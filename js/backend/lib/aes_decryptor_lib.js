// Nodejs AES decryption with CTR
const crypto = require('crypto');
const {readFile} = require('fs').promises;

module.exports = {
    decrypt: async function(cipher, iv, keyLocation) {
        const contents = await readFile(keyLocation, {encoding: 'utf8'});
        const cipherText = Buffer.from(cipher, 'base64');
        const ivBuff = Buffer.from(iv, 'base64');
        const key = Buffer.from(contents, 'base64');
        let decipher;
        try {
            decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuff)
        } catch (e) {
            return {
                text: null,
                err: e
            }
        }
        let plainText = decipher.update(cipherText);
        plainText = Buffer.concat([plainText, decipher.final()]);
        return {
            text: plainText.toString(),
            err: null
        };
    }
}