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
auto: function(text) {
    try {
        const key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
        const iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
        const key = Buffer.from(key_in, 'hex');
        const iv = Buffer.from(iv_in, 'hex');
    } catch(e) {
        console.log('Errors were encountered.');
        return true;
    }
    try {
        const key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
        const iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
        const key = Buffer.from(key_in, 'hex');
        const iv = Buffer.from(iv_in, 'hex');
        return decrypt(text, key, iv);
    } catch(e) {
        console.log(e);
        console.log('Error while decrypting message. Ensure that the AES keyfiles are valid and the encrypted message is not corrupted.');
        return true;
    }
}
}