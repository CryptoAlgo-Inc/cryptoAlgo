var http = require('http');
var url = require('url');
const fs = require('fs');
const aes_decryptor = require('./JavaScript/aes_decryptor_lib');
const aes_encryptor = require('./JavaScript/aes_encryptor_lib');
const aes_keygen = require('./JavaScript/aes_keygen_lib');
const rsa_keygen = require('./JavaScript/keyGen_lib');

var server = http.createServer(function(req, res) {
var page = url.parse(req.url).pathname;
console.log(page);

function success() {
    const successpg = fs.readFileSync('./success.html');
    res.writeHead(200);
    res.write(successpg);
}

if(page == '/') {
    res.writeHead(200);
    const indexHTML = fs.readFileSync('./index.html');
    res.write(indexHTML);
}
else {
    try {
        const queryObject = url.parse(req.url,true).query;
        if(queryObject['filename']) {
            console.log(queryObject['filename']);
            success();
        }
        else if(queryObject['action']) {
            console.log('I am here');
            console.log(queryObject['mode']);

            success();
        }
        else if(queryObject['mode']) {
            console.log('I am here');
            console.log(queryObject['mode']);
            if(queryObject['mode'] === 'aes') {
                try {
                    aes_keygen.auto();
                    success();
                } catch(e) {
                    console.log(e);
                    res.writeHead(500);
                    const errorPg = fs.readFileSync('./error500.html');
                    res.write(errorPg);
                }
            }
            else if(queryObject['mode'] === 'rsa') {
                try {
                    rsa_keygen.auto();
                    success();
                } catch(e) {
                    console.log(e);
                    res.writeHead(500);
                    const errorPg = fs.readFileSync('./error500.html');
                    res.write(errorPg);
                }
            }
        }
        else if(queryObject['decTxt']) {
            console.log(queryObject['decTxt']);
        }
        else {
            const requested = fs.readFileSync('.' + page);
            res.writeHead(200);
            res.write(requested);
        }
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
console.log('Opening default browser...');
const opn = require('opn');
opn('http://localhost:8080');