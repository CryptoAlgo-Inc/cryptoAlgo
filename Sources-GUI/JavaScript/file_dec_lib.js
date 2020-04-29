// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const fs = require('fs');
const path = require('path');
const os = require('os');

function decrypt(text, key_in, iv_in) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key_in), iv_in);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
auto: function(fileName) {
        var key_in;
        var iv_in;
        var key
        var iv;
        try {
            key_in = fs.readFileSync(os.homedir() + '\\Documents\\key.txt', 'utf8');
            iv_in = fs.readFileSync(os.homedir() + '\\Documents\\iv.txt', 'utf8');
            key = Buffer.from(key_in, 'hex');
            iv = Buffer.from(iv_in, 'hex');
        } catch(e) {
            console.log('Could not find or open the AES keyfiles. Please ensure that they are generated and not write protected.');
            return true;
        }
        // console.log('Key: ', key);
        // console.log('IV :', iv);
        try {
            key_in = fs.readFileSync(os.homedir() + '\\Documents\\key.txt', 'utf8');
            iv_in = fs.readFileSync(os.homedir() + '\\Documents\\iv.txt', 'utf8');
            key = Buffer.from(key_in, 'hex');
            iv = Buffer.from(iv_in, 'hex');
            const file_in = fs.readFileSync(path.resolve(fileName), 'utf8');
            const file_dec = decrypt(file_in, key, iv);
            fs.writeFileSync(path.resolve(fileName).slice(0, -10), file_dec);
            console.log('█                        Decrypting...                           █');
            console.log('█             Thank you for using the decryptor!                 █');
            console.log('█         This windows will auto-close in 3.0 seconds.           █');
            console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
        } catch(e) {
            console.log(e);
            console.log('\x1b[31m');
            console.log('Error while decrypting message. Ensure that the AES keyfiles are valid and the file is not corrupt.\x1b[32m');
            console.log('\x1b[0m');
            return true;
        }
        return false;
        console.log('█             Thank you for using the decryptor!                 █');
    }
}