var http = require('http');
var url = require('url');
const fs = require('fs');
const os = require('os');
const aes_decryptor = require('./JavaScript/aes_decryptor_lib');
const aes_encryptor = require('./JavaScript/aes_encryptor_lib');
const aes_keygen = require('./JavaScript/aes_keygen_lib');
const rsa_keygen = require('./JavaScript/keyGen_lib');
const rsa_decryptor = require('./JavaScript/decryptor_lib');
const rsa_encryptor = require('./JavaScript/encryptor_lib');
const file_encryptor = require('./JavaScript/file_enc_lib');
const file_decryptor = require('./JavaScript/file_dec_lib');
const path = require('path');
var requestsServed = 0;
const defaultConfig = '{"onboarding": true, "encryptionCycles": 1, "displayMode": "dark", "textHistory": ["", ""], "RSAkeyPairLen": 8192}';

var server = http.createServer(function(req, res) {
var page = url.parse(req.url).pathname;
requestsServed += 1;
if((requestsServed % 10) == 0) {
    console.log('Requests Served:', requestsServed);
}

// Get config file from storage
try {
    var config_raw = fs.readFileSync(os.homedir() + '\\Documents\\CryptoAlgo\\config\\main.json');
} catch(e) {
    // Write the default values
    var new_config = defaultConfig;
    try {
        fs.mkdirSync(os.homedir() + '\\Documents\\CryptoAlgo');
        fs.mkdirSync(os.homedir() + '\\Documents\\CryptoAlgo\\config');
    } catch(e){}
    fs.writeFileSync((os.homedir() + '\\Documents\\CryptoAlgo\\config\\main.json'), new_config);
}
// Load config obj into memory
var config = JSON.parse(fs.readFileSync(os.homedir() + '\\Documents\\CryptoAlgo\\config\\main.json'));

function renderOutput(input, firstFiller) {
    res.writeHead(200);
    res.write('<html><head><link rel="stylesheet" href="assets/css/main.css" /><title>CryptoAlgo | ' + firstFiller + ' Text Output</title></head>');
    res.write("<script>function removeTag() {window.setTimeout(function() {$('body').removeClass('subpage is-loading');}, 100);}var text = '" + input + "';");
    res.write("function copyText(){navigator.clipboard.writeText(text).then(function() { console.log('Async: Copying to clipboard was successful!');$(\"#copyButton\").fadeOut(function() {$(this).text(\"Copied!\").fadeIn();});setTimeout(function(){ $(\"#copyButton\").fadeOut(function() {$(this).text(\"Copy to clipboard\").fadeIn();}) }, 2000);}, function(err) {console.error('Async: Could not copy text: ', err);});}</script>");
    res.write('<body class="subpage" onload="removeTag()"><section id="banner" data-video="images/banner"><div class="inner"><h1>Success</h1><p id="outputTxt">' + firstFiller + ' text: ' + input + '</p><a href="index.html" class="button alt">Home</a><br /><br />');
    res.write('<a id="copyButton" href="javascript:copyText();" class="button alt">Copy to clipboard</a></div></section>');
    res.write('<!-- Header --><header id="header" class="alt"><div class="logo"><a href="index.html">Crypto<span>Algo</span></a></div><a href="#menu" class="toggle" alt="Open the menu"><span>Menu</span></a></header>');
    res.write('<nav id="menu"><ul class="links"><li><a href="index.html">Home</a></li><li><a href="keygen.html">Generation of AES/RSA keyfiles</a></li><li><a href="generic.html">Decryption/Encryption of text</a></li><li><a href="headAlgo.html">');
    res.write('Decryption/Encryption of header</a></li><li><a href="file.html">Decryption/Encryption of files</a></li><li><a href="contact.html">Contact</a></li><li><a href="info.html">Build Infomation</a></li><li>Beta/Alpha Version:</li><li>V1.8 Alpha 20</li></ul></nav></body></html>');
    res.write('<!-- Footer --><footer id="footer" class="wrapper"><video playsinline="" autoplay="" muted="" loop="" poster="images/banner.webp" id="bgvid"><source src="images/banner.webm" type="video/webm"><source src="images/banner.mp4" type="video/mp4">Your browser does not support the video tag.</video>');
    res.write('<div class="inner"><div class="copyright"><p>&copy; This project is maintained by <a href="mailto:support@cryptoalgo.cf">@CryptoAlgo</a>.</p></div></div></footer>');
    res.write('<script src="assets/js/jquery.min.js"></script><script src="assets/js/jquery.scrolly.min.js"></script><script src="assets/js/jquery.scrollex.min.js"></script><script src="assets/js/skel.min.js"></script><script src="assets/js/util.js"></script><script src="assets/js/main.js"></script>');
}

function updateJSON() {
    fs.writeFileSync(os.homedir() + '\\Documents\\CryptoAlgo\\config\\main.json', JSON.stringify(config));
    console.log('Successfully updated JSON file!');
}

function success() {
    const successpg = fs.readFileSync(path.join(__dirname, 'success.html'));
    res.writeHead(200);
    res.write(successpg);
}

function backToSettings() {
    const successpg = fs.readFileSync(path.join(__dirname, 'settings.html'));
    res.writeHead(200);
    res.write(successpg);
}

if(page == '/') {
    res.writeHead(200);
    if(config.onboarding) {
        const indexHTML = fs.readFileSync(path.join(__dirname, 'onboarding.html'));
        res.write(indexHTML);
        config.onboarding = false;
        updateJSON();
    }
    else {
        const indexHTML = fs.readFileSync(path.join(__dirname, 'index.html'));
        res.write(indexHTML);
    }
}
else {
    try {
        const queryObject = url.parse(req.url,true).query;
        if(queryObject['fileName']) {
            console.log(queryObject['fileName']);
            if(file_encryptor.auto(queryObject['fileName'])) {
                console.log('Errors were encountered.');
                res.writeHead(400);
                const errorPg = fs.readFileSync(path.join(__dirname, 'error400header.html'));
                res.write(errorPg);
            }
            else {
                success();
            }
        }
        if(queryObject['reset']) {
            // Write the default values
            var new_config = defaultConfig;
            try {
                fs.mkdirSync('./config');
            } catch(e){}
            fs.writeFileSync('./config/main.json', new_config);
            success();
        }
        else if(queryObject['fileName_dec']) {
            console.log(queryObject['fileName_dec']);
            if(file_decryptor.auto(queryObject['fileName_dec'])) {
                console.log('Errors were encountered.');
                res.writeHead(400);
                const errorPg = fs.readFileSync(path.join(__dirname, 'error400header.html'));
                res.write(errorPg);
            }
            else {
                success();
            }
        }
        else if(queryObject['keyPairLength']) {
            console.log(queryObject['keyPairLength']);
            if((parseInt(queryObject['keyPairLength']) >= 1000) && (parseInt(queryObject['keyPairLength']) <= 9999)) {
                config.RSAkeyPairLen = parseInt(queryObject['keyPairLength']);
                updateJSON();
                success();
			}
		}
        else if(queryObject['action']) {
            console.log(queryObject['action']);
            if(queryObject['action'] === 'enc') {
                const err = rsa_encryptor.auto();
                if(err) {
                    console.log(err);
                    res.writeHead(400);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error400header.html'));
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
                    res.writeHead(400);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error400header.html'));
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
                    res.writeHead(400);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error400.html'));
                    res.write(errorPg);
                    res.end();
                }
            }
            else if(queryObject['mode'] === 'rsa') {
                try {
                    if(rsa_keygen.auto(config.RSAkeyPairLen)) {
                        // An error was encountered.
                        res.writeHead(400);
                        const errorPg = fs.readFileSync(path.join(__dirname, 'error400.html'));
                        res.write(errorPg);
                    }
                    else {success();}
                } catch(e) {
                    console.log(e);
                    res.writeHead(400);
                    const errorPg = fs.readFileSync(path.join(__dirname, 'error400.html'));
                    res.write(errorPg);
                }
            }
        }
        else if(queryObject['silentKeygen']) {
            try {
                rsa_keygen.auto();
                aes_keygen.auto();
                const welcome = fs.readFileSync(path.join(__dirname, 'welcome.html'));
                res.write(welcome);
            } catch(e) {
                console.log(e);
                res.writeHead(400);
                const errorPg = fs.readFileSync(path.join(__dirname, 'error400.html'));
                res.write(errorPg);
            }
        }
        else if(queryObject['textIn']) {
            console.log(queryObject['textIn']);
            plainText = queryObject['textIn'];
            console.log(aes_encryptor.auto(plainText));
            if(aes_encryptor.auto(plainText) == true) {
                console.log("Got here!");
                res.writeHead(400);
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
            if(aes_decryptor.auto(encrypted) == true) {
                res.writeHead(400);
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
            res.write(requested);
        }
    } catch(e) {
        res.writeHead(404);
        const errorPg = (path.join(__dirname, 'error404.html'));
        res.write(errorPg);
    }
}
res.end();
});

var port = '34235';
    server.on('error', function (e) {
        console.log('There has been an error. ');
        
    });
server.listen(34235);
console.log('Listening on port', port);

var child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\CryptoAlgo\\cryptoalgo.exe";
var parameters = ["--app=http://localhost:" + port];

try {
    child(executablePath, parameters, function(err, data) {
        if(err) {
            console.log('Try 0');
            console.log('An error was encountered opening the Chrome Engine.');
            console.log('Please report this error to the developer');
            console.log(err);
            child("C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", parameters, function(err, data) {
                if(err) {
                    console.log('Try 1');
                    console.log(err);
                    child("C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", parameters, function(err, data) {
                        if(err) {
                            console.log('Try 2');
                            console.log(err);
                            process.exit();
                        }
                        else {
                            process.exit();
                        }
                    });
                }
                else {
                    console.log("I exit here!");
                    process.exit();
                }
            });
	}
        else {
            console.log('Window has been closed');
            console.log('Total pages served:', requestsServed);
            console.log('Exiting...');
            process.exit();
	}
    });
} catch(e) {
    console.log('Could not start Chrome');
}