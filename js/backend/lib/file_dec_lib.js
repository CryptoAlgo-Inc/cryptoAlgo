// NodeJS AES file decryption

const crypto = require('crypto');
const { readFile }  = require('fs').promises;
const { writeFile } = require('fs');

module.exports = {
    decrypt: async function(fileIn, fileOut, keyFile) {
        const cipherFile = await readFile(fileIn, {encoding: 'utf8'});
        const cipher = cipherFile.toString().slice(0, -24);
        const keyfile = await readFile(keyFile, {encoding: 'utf8'});
        const key = Buffer.from(keyfile, 'base64');
        const iv = cipherFile.toString().slice(-24);
        const ivBuff = Buffer.from(iv, 'base64');

        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuff)
            let decFile = decipher.update(Buffer.from(cipher, 'base64'));
            decFile = Buffer.concat([decFile, decipher.final()]);
            // Write output file
            writeFile(fileOut, decFile, function(err)
            {
                if (err) console.error(err);
                return !!err;
            });
            return 0;
        } catch (e) {
            return e;
        }
    }
}