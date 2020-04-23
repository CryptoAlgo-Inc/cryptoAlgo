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
auto: function(callback) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
    const iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
    const key = Buffer.from(key_in, 'hex');
    const iv = Buffer.from(iv_in, 'hex');
    console.log('\x1b[36m');
    console.log('██████████████████████████████████████████████████████████████████');
    readline.question('█          Please key in the message to be encrypted             █\n', msg => {
        if(msg === 'exit') {
            callback();
        }
        else {
        // console.log('Key: ', key);
        // console.log('IV :', iv);
        console.log('█                        Encrypting...                           █');
        try {
            console.log('Encrypted text: ', encrypt(msg, key, iv));
        } catch(e) {
            console.log(e);
            console.log('Error while encrypting message. Ensure that the AES keyfiles are valid and the encrypted message is not corrupted.');
            callback();
        }
        // console.log('█             Thank you for using the encryptor!                 █'\x1b[0m'');
        readline.close();
        const decrypt = require('./cont_decryptor');
        decrypt.auto(callback);
        }
    });
}
}