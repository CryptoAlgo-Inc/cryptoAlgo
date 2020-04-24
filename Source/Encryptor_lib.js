// Libraries for RSA encryption
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
    const publicKey = fs.readFileSync(absolutePath, 'utf8')
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('hex')
}

module.exports = {
auto: function() {
    const iv = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
    const key = fs.readFileSync(path.resolve('key.txt'), 'utf8');
    // Autoencrypt the data
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█ Welcome to the RSA encrypter written partially by Vincent Kwok █');
    console.log('█                         Encrypting...                          █');
    const enc_key = encrypt(key, 'public.pem');
    const enc_iv = encrypt(iv, 'public.pem');
    console.log('█                           Writing...                           █');
    fs.writeFileSync('enc_key.txt', enc_key);
    fs.writeFileSync('enc_iv.txt', enc_iv);
    console.log('█                            Done!                               █');
    console.log('█               Thank you for using the encryptor                █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
    setTimeout(function() {
        process.exit();
    }, 2500);
}
};