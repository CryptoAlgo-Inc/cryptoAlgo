var http = require('http');
var url = require('url');
const fs = require('fs');
const aes_decryptor = require('./JavaScript/aes_decryptor_lib');
const aes_keygen = require('./JavaScript/aes_keygen_lib');

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
        const queryObject = url.parse(req.url,true).query;
        const filename = queryObject['filename'];
        if(filename) {
            console.log(filename);
        }
        const keygenMode = queryObject['mode'];
        else if(keygenMode) {
            console.log('I am here');
            console.log(keygenMode);
            if(keygenMode === 'aes') {
                console.log('I reached here');
                aes_keygen.auto();
            }
        }
        const text_dec = queryObject['decTxt'];
        else if(text_dec) {
            console.log(keygenMode);
        }
        const requested = fs.readFileSync('.' + page);
        res.writeHead(200);
        res.write(requested);
    } catch(e) {
        console.log(e);
        res.writeHead(404);
        const errorPg = fs.readFileSync('./error404.html');
        res.write(errorPg);
    }
}
res.end();
});
server.listen(8080);
console.log('Listening on port 8080');