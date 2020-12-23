// NodeJS AES encryption with CTR
const crypto = require('crypto');
const { readFile } = require('fs').promises;

module.exports = {
    encrypt: async function(text, keyLocation) {
        const contents = await readFile(keyLocation, {encoding: 'utf8'});
        const key = Buffer.from(contents, 'base64');
        const iv = crypto.randomBytes(16);
        let cipher;
        try {
            cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        } catch (e) {
            return {
                cipher: null,
                iv: null,
                err: e
            }
        }
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            cipher: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            err: null
        };
    }
}