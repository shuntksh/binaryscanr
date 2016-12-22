FROM ubuntu:trusty
MAINTAINER Shun Takahashi <@shuntksh>

# Install Tclsh8.6
RUN apt-get update
RUN apt-get -y install apt-utils
RUN apt-get -y install tcl8.6 tcllib

COPY binaryscanr.tcl /opt/binaryscanr.tcl

EXPOSE 8001/tcp

ENTRYPOINT exec /usr/bin/tclsh8.6 opt/binaryscanr.tcl
