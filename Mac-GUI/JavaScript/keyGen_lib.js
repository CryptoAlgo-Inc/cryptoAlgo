const { writeFileSync } = require('fs');
const { generateKeyPairSync } = require('crypto');
const os = require('os');
 
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
    try {
        writeFileSync(os.homedir() + '/Documents/private.pem', privateKey);
        writeFileSync(os.homedir() + '/Documents/public.pem', publicKey);
    } catch(e) {
        return 1;
    }
    console.log('█                 Done generating RSA key pair.                  █');
}

module.exports = {
auto: function(modLength) {
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█          Key in the key pair modulus length (1-50000)          █\n██████████████████████████████████████████████████████████████████\n');
    console.log(modLength);
    const length = modLength;
    console.log('█                  Generating RSA keypair...                     █');
    generateKeys(length);
    console.log('█              Thank you for using this program!                 █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
    return 0;
}
};
