const { writeFile } = require('fs');
const { generateKeyPair } = require('crypto');

module.exports = {
    // Returns non zero on error, zero on success
    gen: function(modLength, password, location, callback) {
        generateKeyPair('rsa', {
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
        }, (err, publicKey, privateKey) => {
            // Check for error
            if (err) {
                console.error(err);
                return 3;
            }

            // Then, save to disk
            const regex = /.pem$/gm; // Add -pri/-pub to end of filename, before file ext
            writeFile(location.replace(regex, `-pri.pem`), privateKey, function(err) {
                if (err) {
                    console.error(err);
                    callback(2);
                }
                writeFile(location.replace(regex, `-pub.pem`), publicKey, function(err) {
                    if (err) {
                        console.error(err);
                        callback(1);
                    }
                    else {
                        console.debug('<RSA_Keygen_lib> Done generating one keyfile');
                        callback(null);
                    }
                });
            });
        });
    }
};