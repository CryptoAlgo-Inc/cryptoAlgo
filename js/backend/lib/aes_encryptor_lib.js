// NodeJS AES encryption with CTR
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
    encrypt: async function(text, keyLocation) {
        const key_in = await fs.readFileSync(keyLocation, 'utf8');
        const key = Buffer.from(key_in, 'base64');
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            cipher: encrypted.toString('base64'),
            iv: iv.toString('base64')
        };
    }
}