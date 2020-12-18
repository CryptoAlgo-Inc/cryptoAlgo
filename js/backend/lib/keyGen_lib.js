const { writeFile } = require('fs');
const { generateKeyPair } = require('crypto');
const os = require('os');
 
async function generateKeys(len, pass) {

    return {
        pri: privateKey,
        pub: publicKey
    }
}

module.exports = {
    // Returns non zero on error, zero on success
    auto: async function(modLength, password, location) {
        const { privateKey, publicKey } = await generateKeyPair('rsa', {
            modulusLength: modLength,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: password,
            },
        }, function(err) {
            // Check for error
            if (err) {
                console.error(err);
                return 3;
            }

            // Save to disk
            const regex = /.pem$/gm; // Add -pri/-pub to end of filename, before file ext
            writeFile(location.replace(regex, `-pri.pem`), privateKey, function(err) {
                if (err) {
                    console.error(err);
                    return 2;
                }
                writeFile(location.replace(regex, `-pub.pem`), publicKey, function(err) {
                    if (err) {
                        console.error(err);
                        return 1;
                    }
                    else return 0;
                });
            });
        })
    }
};