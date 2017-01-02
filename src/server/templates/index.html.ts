/* tslint:disable:max-line-length */
export function getIndexHtml(csrfToken: string): string {
  return `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="binaryscanr is a tcl binary scan filter editor and tester. It's a handy way to test binary scan command against your data set from Wireshark or tcpdump to write your own protocol desector.">
        <meta name="keywords" content="tcl, binary scan, binary format">
        <meta name="author" content="Sean Takahashi">
        <title>binaryscanr - A tcl binary scan filter editor</title>
    </head>
    <body>
        <script>window.csrfToken=${csrfToken}</script>
        <div id="main"></div>
    </body>
</html>  
  `;
}

export default getIndexHtml;
