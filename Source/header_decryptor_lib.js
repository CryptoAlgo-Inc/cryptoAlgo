// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const fs = require('fs');
const path = require('path')

function decrypt(text, key_in, iv_in) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key_in), iv_in);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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
    readline.question('█             Please key in the encrypted message.               █\n', msg => {
        console.log('Key: ', key);
        console.log('IV', iv);
        console.log('█                        Decrypting...                           █');
        try {
            console.log('Decrypted text: ', decrypt(msg, key, iv));
        } catch(e) {
            console.log('Error while decrypting message. Ensure that the AES keyfiles are valid and the encrypted message is not corrupted.');
        }
        console.log('█             Thank you for using the decryptor!                 █');
        console.log('█         This windows will auto-close in 10 seconds.            █');
        console.log('██████████████████████████████████████████████████████████████████');
        readline.close();
        setTimeout(function() {
            process.exit();
        }, 10000);
    });
}
}