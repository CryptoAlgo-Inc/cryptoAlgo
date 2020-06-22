// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const fs = require('fs');
const path = require('path')
const os = require('os');

function encrypt(text, key, iv) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
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
        console.log('\x1b[36m██████████████████████████████████████████████████████████████████');
        // console.log('Key: ', key);
        // console.log('IV :', iv);
        try {
        console.log(path.extname(fileName));
            if (!(['.txt', '.js', '.py', '.html', '.xml', '.css', '.json', '.c', '.cpp', '.h', '.cs', '.java', '.rb', '.pl', '.php', '.sh'].indexOf(path.extname(fileName)) >= 0)) {
               console.log('Please ensure that file is a binary file.');
               return true;
            }
            key_in = fs.readFileSync(os.homedir() + '\\Documents\\key.txt', 'utf8');
            iv_in = fs.readFileSync(os.homedir() + '\\Documents\\iv.txt', 'utf8');
            key = Buffer.from(key_in, 'hex');
            iv = Buffer.from(iv_in, 'hex');
            const file_in = fs.readFileSync(path.resolve(fileName));
            const file_enc = encrypt(file_in, key, iv);
            console.log('█                        Encrypting...                           █');
            fs.writeFileSync(path.resolve(fileName) + '.filecrypto', file_enc);
        } catch(e) {
            console.log(e);
            console.log('Error while encrypting message. Ensure that the AES keyfiles are valid and the file is present.\x1b[36m');
            return true;
        }
        console.log('█             Thank you for using the encryptor!                 █');
        console.log('█         This windows will auto-close in 3.0 seconds.           █');
        console.log('██████████████████████████████████████████████████████████████████');
        console.log('\x1b[0m');
        return false;
    }
}