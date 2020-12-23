// Nodejs encryption with CTR

const crypto = require('crypto');
const { readFile }  = require('fs').promises;
const { writeFile } = require('fs');

module.exports = {
    encrypt: async function(fileIn, fileOut, keyFile) {
        const plainFile = await readFile(fileIn, {encoding: null});
        const contents = await readFile(keyFile, {encoding: 'utf8'});
        const key = Buffer.from(contents, 'base64');
        const iv = crypto.randomBytes(16);
        let cipher;
        try {
            cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        } catch (e) {
            return true;
        }
        let encrypted = cipher.update(plainFile);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // Write output file
        writeFile(fileOut, encrypted.toString('base64') + iv.toString('base64'), function(err)
        {
            if (err) console.error(err);
            return !!err;
        });
    }
}