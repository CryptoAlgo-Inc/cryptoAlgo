var http = require('http');
var url = require('url');
const fs = require('fs');
const aes_decryptor = require('./JavaScript/aes_decryptor_lib');
const aes_encryptor = require('./JavaScript/aes_encryptor_lib');
const aes_keygen = require('./JavaScript/aes_keygen_lib');
const rsa_keygen = require('./JavaScript/keyGen_lib');
const rsa_decryptor = require('./JavaScript/decryptor_lib');
const rsa_encryptor = require('./JavaScript/encryptor_lib');
const path = require('path');

var server = http.createServer(function(req, res) {
var page = url.parse(req.url).pathname;
global.newStuff = true;
console.log(page);

function renderOutput(input, firstFiller) {
    res.writeHead(200);
    res.write('<html><head><link rel="stylesheet" href="assets/css/main.css" /></head>');
    res.write('<body class="subpage"><!-- Header --><header id="header" class="alt"><div class="logo"><a href="index.html">Crypto<span>Algo</span></a></div><a href="#menu" class="toggle" alt="Open the menu"><span>Menu</span></a></header>');
    res.write('<nav id="menu"><ul class="links"><li><a href="index.html">Home</a></li><li><a href="keygen.html">Generation of AES/RSA keyfiles</a></li><li><a href="generic.html">Decryption/Encryption of text</a></li><li><a href="headAlgo.html">Decryption/Encryption of header</a></li><li><a href="file.html">Decryption/Encryption of files</a></li>');
    res.write('<li><a href="contact.html">Contact</a></li><li>Beta/Alpha Version:</li><li>V1.8 Alpha 20</li></ul></nav><section id="banner" data-video="images/banner"><div class="inner"><h1>Success</h1><p>' + firstFiller + ' text: ' + input + '</p><a href="index.html" class="button alt">Home</a></div></section></body></html>');
    res.write('<script src="assets/js/jquery.min.js"></script><script src="assets/js/jquery.scrolly.min.js"></script><script src="assets/js/jquery.scrollex.min.js"></script><script src="assets/js/skel.min.js"></script><script src="assets/js/util.js"></script><script src="assets/js/main.js"></script>');
}

function success() {
    const successpg = fs.readFileSync(path.join(__dirname, 'success.html'));
    res.writeHead(200);
    res.write(successpg);
}

global.plainText='apples';

if(page == '/') {
    res.writeHead(200);
    const indexHTML = fs.readFileSync(path.join(__dirname, 'index.html'));
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
            console.log(queryObject['action']);
            if(queryObject['action'] === 'enc') {
                const err = rsa_encryptor.auto();
                if(err) {
                    console.log(err);
                    res.writeHead(500);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error500header.html'));
                    res.write(errorPg);
                }
                else {
                    success();        
                }

            }
            else if(queryObject['action'] === 'dec') {
                const err = rsa_decryptor.auto();
                if(err) {
                    console.log(err);
                    res.writeHead(500);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error500header.html'));
                    res.write(errorPg);
                }
                else {
                    success();        
                }
            }
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
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error500.html'));
                    res.write(errorPg);
                    res.end();
                }
            }
            else if(queryObject['mode'] === 'rsa') {
                try {
                    rsa_keygen.auto();
                    success();
                } catch(e) {
                    console.log(e);
                    res.writeHead(500);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error500.html'));
                    res.write(errorPg);
                }
            }
        }
        else if(queryObject['textIn']) {
            console.log(queryObject['textIn']);
            plainText = queryObject['textIn'];
            if(aes_encryptor.auto(plainText) == true) {
                res.writeHead(500);
                const errorPg = fs.readFileSync(path.join(__dirname, 'error500header.html'));
                res.write(errorPg);
            }
            else {
                renderOutput(aes_encryptor.auto(plainText), "Encrypted");
            }
        }
        else if(queryObject['encIn']) {
            console.log(queryObject['encIn']);
            encrypted = queryObject['encIn']
            if(aes_decryptor.auto(encrypted)) {
                res.writeHead(500);
                const errorPg = fs.readFileSync(path.join(__dirname, 'error500header.html'));
                res.write(errorPg); 
            }
            else {
                renderOutput(aes_decryptor.auto(encrypted), "Decrypted");
            }
        }
        else {
            const requested = fs.readFileSync(path.join(__dirname, page));
            res.writeHead(200);
            console.log(res.write(requested));
        }
    } catch(e) {
        console.log(e);
        res.writeHead(404);
        const errorPg = fs.readFileSync(path.join(__dirname, 'error404.html'));
        res.write(errorPg);
    }
}
res.end();
});
server.listen(8080);
console.log('Listening on port 8080');
console.log('Opening embedded Chrome in Application mode...');
var cp = require("child_process");
cp.exec('start chrome.exe --app="http://localhost:8080"');