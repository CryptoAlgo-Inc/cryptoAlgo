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

    const key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
    const iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
    const key = Buffer.from(key_in, 'hex');
    const iv = Buffer.from(iv_in, 'hex');
    console.log('██████████████████████████████████████████████████████████████████');
    readline.question('█          Please key in the message to be encrypted             █\n', msg => {
        console.log('Key: ', key);
        console.log('IV :', iv);
        console.log('█                        Encrypting...                           █');
        try {
            console.log('Encrypted text: ', encrypt(msg, key, iv));
        } catch(e) {
            console.log(e);
            console.log('Error while encrypting message. Ensure that the AES keyfiles are valid and the encrypted message is not corrupted.');
        }
        console.log('█             Thank you for using the encryptor!                 █');
        console.log('█         This windows will auto-close in 10 seconds.            █');
        console.log('██████████████████████████████████████████████████████████████████');
        readline.close();
        setTimeout(function() {
            process.exit();
        }, 10000);
    });
}
}