// NodeJS AES keyfile encryption/decryption with RSA
const crypto = require('crypto');
const { readFile } = require('fs').promises;
const { writeFile } = require('fs');

module.exports = {
    encrypt: async function(pubKeyLoc, aesKeyLoc, writeLoc) {
        const publicKey = await readFile(pubKeyLoc, {encoding: 'utf8'});
        const aesKey    = await readFile(aesKeyLoc, {encoding: 'utf8'});
        const encBuffer = Buffer.from(aesKey, 'utf8');

        // Encrypt AES Keyfile (RSA is much easier than AES encryption)
        const encrypted = crypto.publicEncrypt(publicKey, encBuffer);

        // Write encrypted AES keyfile to FS
        writeFile(writeLoc, encrypted, (err) =>
        {
            if (err) console.error(err);
            return !!err;
        });
    }
};