#
# BINARYSCANR.tcl - A tcl backend service for binaryscanr.com
#
# Author        Shun Takahashi <@shuntksh>
#
# Description   This is a TCL backend for binaryscanr.com, a web service to 
#               provide visual UI for testing binary scan command against 
#               various input in real time.
#
#               The script provides following REST API end-points for external
#               systems to call.
# 
#                  GET:/api/status    - For health checking    
#                  POST:/api/process  - For data processing
#
#               1) "/api/status" shall return following JSON body in response
#               but evaluating response code alone shall suffice the purpose.
#
#                  Request: GET:/api/status
#                  Response: { "status": "ok" }
#
#               2) "/api/process" expects following JSON message to be sent. Otherwise,
#               request will be ignored.
#
#                  Request: POST:/api/process
#
#                    { 
#                      "input": <string>HEX_STRING_INPUT,
#                      "formatString": <string>
#                    }
#
#                  Response: { "results": <array> }
#
# Usage         Though this script is intended to run inside a Docker container
#               with using attached Dockerfile, you can run it by simply running
#               tclsh command.
#
#                    % tclsh binaryscanr.tcl
#
#               The script will then create a socket on TCP/8001 (default) to 
#               start listen on API request. 
#
# Restriction   Current version of the script uses json tcllib which has dependency
#               to dict package which is included in tcl 8.5 or newer. Older tcl support
#               will be added in future.
# 
package require json
package require json::write

array set StatusCode {
    200 {OK}
    204 {NO CONTENT}
    400 {BAD REQUEST}
    404 {NOT FOUND}
    405 {METHOD NOT ALLOWED}
    413 {REQUEST ENTITY TOO LARGE}
    500 {INTERNAL SERVER ERROR}
}

# -------------------------------------------------------------------------
# port    - Listen Port (exit(1) if already taken)
# timeout - Timeout between request start and finish (ms)
# max_len - Max POST body size (byte)
# -------------------------------------------------------------------------
array set APP {
    server_name "binaryscanr-tcl-server/v0.1.0"
    port	    8001
    timeout	  500
    max_len	  4096
    api_path  /api/process
    health_check_path /api/status
}


# -------------------------------------------------------------------------
# Create a socket with given configuration for API service
# -------------------------------------------------------------------------
proc StartServer {} {
    global APP
    set APP(server) [socket -server AcceptClient $APP(port)]
    puts "API Server is started on localhost:$APP(port)"
}


# -------------------------------------------------------------------------
# Create a handler for accepting client connections
# -------------------------------------------------------------------------
proc AcceptClient { chan ip port } {
    global APP
    upvar #0 APP$chan req
    fconfigure $chan -blocking 0 -translation { auto crlf }
    fileevent $chan readable [list ReceiveData $chan]
    after $APP(timeout) [list CloseConnection $chan]
}


# -------------------------------------------------------------------------
# Flush and close a connection
# -------------------------------------------------------------------------
proc CloseConnection { chan } {
    upvar #0 APP$chan req
    close $chan
    if { [info exists req] } { unset req }
    after cancel [list CloseConnection $chan]
}


# -------------------------------------------------------------------------
# Read socket to construct HTTP request header & body
# -------------------------------------------------------------------------
proc ReceiveData { chan } {
    global APP
    upvar #0 APP$chan req
    
    set line_len [gets $chan line]

    # Clean up vars when connection closed by client
    if { [eof $chan] && [info exists req] } { CloseConnection $chan; return }

    # HTTP Header Matching - Method / URL Path 
    if {![info exists req(method)] && ![info exists req(url)] } {
        if [regexp {^(\w+) ([^?]+)\?* HTTP/(1.[01])} $line matched req(method) req(url) req(ver)] {
            catch {
                if { $req(method) != "GET" && $req(method) != "POST" } {
                    HttpRespond $chan 400
                    return
                }

                # Simple URL validation
                if { $req(url) != $APP(api_path) && $req(url) != $APP(health_check_path) } {
                    HttpRespond $chan 405
                    return
                }

                # Respond to health checking request
                if { $req(method) == "GET" && $req(url) == $APP(health_check_path) } {
                    HttpRespond $chan 200 "[::json::write object status ok]\n"
                    return
                }
            }
            return 
        }
    }

    # HTTP Header Matching - Content-Length
    if { ![info exists req(len)] } {
        if [regexp {^Content-Length: (\d+)} $line matched req(len)] {
            if { $req(len) > $APP(max_len) } { HttpRespond $chan 413 }
            return    
        }
    }

    # HTTP POST Body Processing (State changes from START > APPENDING > PARSE) by
    # comparing $req(body) and $req(len). There is a flaw where sender does not include
    # Content-Length header or ignore it. It will then be timeout and close connection.
    catch {
      # Ignore lines unless it sees method, url, and content-length
      if { $req(method) != "POST" || $req(url) != $APP(api_path) || $req(len) == 0 } { return }

      # Find the end of HTTP Header (empty line), switch to body parsing mode
      if {![info exists req(body)] && $line_len == 0 } { 
        set req(body) ""
        return 
      }

      # Append "line" to the request body strings
      if { [string length $req(body)] <= $req(len) } { append req(body) "$line\n" }

      # Start to process if entire body is received. Otherwise connection will timeout.
      # Note: Right now client (app server) needs to send body end with \n.  
      if { [string length $req(body)] >= $req(len) } {
        ScanAndRespond $chan $req(body)
        return
      }
    }
  }


# -------------------------------------------------------------------------
# Generate and send HTTP response to client and close connection.
# -------------------------------------------------------------------------
proc HttpRespond { chan code {body ""} } {
    global StatusCode APP
    upvar #0 APP$chan req

    if { ![info exists code] } { 
        set code 500 
    }

    if {$body == ""} {
        switch -- $code {
            400 -
            404 -
            413 -
            500 {set body "[::json::write object "error" "$code $StatusCode($code)"]\n"}
            405 {set body "[::json::write object "error" "allow: GET POST"]\n"}
        }
    } 

    if { ![info exists $req(ver)] || ![regexp {1.[01]} $req(ver)] } {
        set req(ver) 1.0
    }

    # Sending HTTP Response Header Lines
    puts $chan "HTTP/$req(ver) $code $StatusCode($code)"
    puts $chan "Connection: close"
    puts $chan "Content-Length: [string length $body]"
    puts $chan "Content-Type: application/json"
    puts $chan "Date: [clock format [clock seconds] -format {%a, %d %b %Y %T %Z}]"
    puts $chan "Server: $APP(server_name)"
    puts $chan ""

    # Sending HTTP Response Body
    fconfigure $chan -blocking 0 -translation binary
    puts -nonewline $chan "$body"
    flush $chan

    # Then close the connection
    CloseConnection $chan
}


# -------------------------------------------------------------------------
# Parse and process user input and respond the result
# -------------------------------------------------------------------------
proc ScanAndRespond { chan {body ""} } {
    # Internal Server Error if failed to parse JSON
    if { [catch {set body [::json::json2dict $body]} error]} {
        set msg "[::json::write string "JSON Parse Error :: $error"]"
        HttpRespond $chan 500 "[::json::write object error $msg]\n"
        return
    }

    # Return 204 No Content if keys are missing (ToDo: Behaviour subject to change)
    if {![dict exists $body "input"] || ![dict exists $body "formatString"] } {
        HttpRespond $chan 204
        return
    }

    set input [dict get $body "input"]
    set formatString [dict get $body "formatString"]

    if { ![isValidInput $input] } {
        set msg "[::json::write string "Invalid input :: $input"]"
        HttpRespond $chan 400 [::json::write object error $msg]
        return
    }

    # Extract format part and validate the input
    set formatString [lindex [split [string trim $formatString] { }] 0]
    if { ![isValidFormat $formatString] } {
        set msg "[::json::write string "Invalid formatString :: $formatString"]"
        HttpRespond $chan 400 [::json::write object error $msg]
        return
    }

    _scan_and_respond $chan $input $formatString
    return
}


# -------------------------------------------------------------------------
# Take user input and returns binary scan command string for eval
# -------------------------------------------------------------------------
proc _scan_and_respond { chan input formatString } {
    set ALLOWED_CHARS {a A b B h H c s S i I w W f d x X}

    set n 0
    set vars {}

    # Prepare variable names to store scan result (need to be exact)
    foreach c [split $formatString {}] {
        if {[lsearch -exact $ALLOWED_CHARS $c] != -1} {
            set vars [string trim "$vars var$n"]
            incr n
        }
    }

    # Convert input string to hexadecimal
    if [catch { set input [binary format H* $input] } error] {
        puts "ERROR"
        HttpRespond $chan 500 "[::json::write object error $error]\n"
        return
    }

    # Run binary scan command and collect results
    set cmd "set matched_count \[binary scan \$input \$formatString $vars \]"
    if [catch { eval $cmd } error] {
        set msg [::json::write array [_scan $input $formatString]]
        HttpRespond $chan 500 "[::json::write object error $msg]\n"
        return 
    }

    # Concat results into array
    set results {}
    for {set i 0} {$i < $matched_count} {incr i} {
        set results "$results [::json::write string [set var$i]], "
    }

    set msg [::json::write array [string trim $results ", "] ]
    HttpRespond $chan 200 "[::json::write object results $msg]\n"
    return
}


# -------------------------------------------------------------------------
# Validate user input and make sure to only include hexadecimal characters
# (vis. 0-9 and A-F) and returns boolean value. (0: false, 1: true)
# -------------------------------------------------------------------------
proc isValidInput { str } {
    global APP
    if { [string length $str] > $APP(max_len) } { return 0 }
    if {![regexp {^[a-fA-F0-9]+$} $str]  }      { return 0 }
    return 1
}


# -------------------------------------------------------------------------
# Validate formatString is in a right binary scan format 
# -------------------------------------------------------------------------
proc isValidFormat { str } {
    global APP
    if {![regexp {(^\*$|^([\@ABHIQRSWXabcdfhinqrstwx](?:\d+|\*)?)+$)} $str x] } {
        return 0 
    }
    return 1
}


# -------------------------------------------------------------------------
#   __main__
# -------------------------------------------------------------------------

# Start API service
StartServer

# Enters the event loop
vwait forever
