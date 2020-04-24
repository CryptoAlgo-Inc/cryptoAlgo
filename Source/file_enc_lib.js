// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const fs = require('fs');
const path = require('path')

function encrypt(text, key, iv) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

module.exports = {
auto: function() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var key_in;
    var iv_in;
    var key
    var iv;

    try {
        key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
        iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
        key = Buffer.from(key_in, 'hex');
        iv = Buffer.from(iv_in, 'hex');
    } catch(e) {
        console.log('Could not find or open the AES keyfiles. Please ensure that they are generated and not write protected.');
    }
    console.log('██████████████████████████████████████████████████████████████████');
    const listfiles = require('./listDir');
    file_list = listfiles.auto(false);
    console.log('\x1b[36m██████████████████████████████████████████████████████████████████');
    readline.question('█   Key in the corrosponding number of the file to be encrypted  █\n', filenum => {
        // console.log('Key: ', key);
        // console.log('IV :', iv);
        try {
            if((parseInt(filenum) > 0) && (parseInt(filenum) <= file_list.length)){
                const file_in = fs.readFileSync(path.resolve(file_list[parseInt(filenum)-1]), 'utf8');
                const file_enc = encrypt(file_in, key, iv);
                console.log('█                        Encrypting...                           █');
                fs.writeFileSync(('encrypted_' + file_list[parseInt(filenum)-1]), file_enc);
            }
            else {
                console.log('█                Please key in a valid number                    █');
                console.log('█             Thank you for using the encryptor!                 █');
                console.log('█         This windows will auto-close in 3.0 seconds.           █');
                console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
                readline.close();
                setTimeout(function() {
                    process.exit();
                }, 3000);
            }
        } catch(e) {
        console.log(e);
            console.log('Error while encrypting message. Ensure that the AES keyfiles are valid and the file is present.\x1b[36m');
        }
        console.log('█             Thank you for using the encryptor!                 █');
        console.log('█         This windows will auto-close in 3.0 seconds.           █');
        console.log('██████████████████████████████████████████████████████████████████');
        console.log('\x1b[0m');
        readline.close();
        setTimeout(function() {
            process.exit();
        }, 3000);
    });
}
}