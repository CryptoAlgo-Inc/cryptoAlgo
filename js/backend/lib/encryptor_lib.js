// NodeJS AES keyfile encryption/decryption with RSA
const crypto = require('crypto');
const { readFile } = require('fs').promises;
const { writeFile } = require('fs');

module.exports = {
    encrypt: async function(pubKeyLoc, aesKeyLoc, writeLoc) {
        const publicKey = await readFile(pubKeyLoc, {encoding: 'utf8'});
        const aesKey    = await readFile(aesKeyLoc, {encoding: 'utf8'});
        const encBuffer = Buffer.from(aesKey, 'utf8');

        try {
            // Encrypt AES Keyfile (RSA is much easier than AES encryption)
            const encrypted = crypto.publicEncrypt(publicKey, encBuffer);

            // Write encrypted AES keyfile to FS
            writeFile(writeLoc, encrypted.toString('base64'), (err) =>
            {
                if (err) console.error(err);
                return !!err;
            });
        } catch (e) {
            console.error('Error thrown while encrypting AES keyfile:\n\n', e);
            return 1;
        }
    },

    decrypt: async function(priKeyLoc, priKeyPwd, aesKeyLoc, writeLoc) {
        const priKey    = await readFile(priKeyLoc, {encoding: 'utf8'});
        const encAESKey = await readFile(aesKeyLoc, {encoding: 'utf8'});
        const decBuffer = Buffer.from(encAESKey, 'base64');

        // Encrypt AES Keyfile (RSA is much easier than AES encryption)
        try {
            const decrypted = crypto.privateDecrypt({
                key: priKey,
                passphrase: priKeyPwd
            }, decBuffer);

            // Write encrypted AES keyfile to FS
            writeFile(writeLoc, decrypted.toString('utf8'), (err) =>
            {
                if (err) console.error(err);
                return !!err;
            });
        } catch (e) {
            console.error('Error thrown while decrypting AES keyfile:\n\n', e);
            return 1;
        }
    }
};