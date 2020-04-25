var http = require('http');
var url = require('url');
const fs = require('fs');

var server = http.createServer(function(req, res) {
var page = url.parse(req.url).pathname;
console.log(page);
if(page == '/') {
    res.writeHead(200, {"Content-Type": "text/html"});
    const indexHTML = fs.readFileSync('./index.html');
    res.write(indexHTML);
}
else {
    try {
        const requested = fs.readFileSync('.' + page);
        res.writeHead(200);
        res.write(requested);
    } catch(e) {
        res.writeHead(404);
        const errorPg = fs.readFileSync('./error404.html');
        res.write(errorPg);
    }
}
res.end();
});
server.listen(8080);
console.log('Listening on port 8080');