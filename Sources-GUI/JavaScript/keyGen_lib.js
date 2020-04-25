const { writeFileSync } = require('fs');
const { generateKeyPairSync } = require('crypto');
 
function generateKeys(len) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: len,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
        },
    })
    console.log('█                           Writing...                           █');
    writeFileSync('private.pem', privateKey);
    writeFileSync('public.pem', publicKey);
    console.log('█                 Done generating RSA key pair.                  █');
}

module.exports = {
auto: function() {
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█          Key in the key pair modulus length (1-50000)          █\n██████████████████████████████████████████████████████████████████\n');
    console.log('9999');
    const length = 9999;
    console.log('█                  Generating RSA keypair...                     █');
    generateKeys(length);
    console.log('█              Thank you for using this program!                 █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
}
};