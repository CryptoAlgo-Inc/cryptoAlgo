// Libraries for RSA encryption
const crypto = require('crypto')
const os = require('os');
const fs = require('fs')

function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
    const publicKey = fs.readFileSync(os.homedir() + '/Documents/public.pem', 'utf8')
    const buffer = Buffer.from(toEncrypt, 'utf8')
    const encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('hex')
}

module.exports = {
auto: function() {
    try {
        const iv = fs.readFileSync(os.homedir() + '/Documents/iv.txt', 'utf8');
        const key = fs.readFileSync(os.homedir() + '/Documents/key.txt', 'utf8');
    } catch(e) {
        console.log(e);
        console.log('Could not open AES keyfiles.')
        return true;
    }
    // Autoencrypt the data
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█ Welcome to the RSA encrypter written partially by Vincent Kwok █');
    console.log('█                         Encrypting...                          █');
    const iv = fs.readFileSync(os.homedir() + '/Documents/iv.txt', 'utf8');
    const key = fs.readFileSync(os.homedir() + '/Documents/key.txt', 'utf8');
    const enc_key = encrypt(key, 'public.pem');
    const enc_iv = encrypt(iv, 'public.pem');
    console.log('█                           Writing...                           █');
    fs.writeFileSync(os.homedir() + '/Documents/enc_key.txt', enc_key);
    fs.writeFileSync(os.homedir() + '/Documents/enc_iv.txt', enc_iv);
    console.log('█                            Done!                               █');
    console.log('█               Thank you for using the encryptor                █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
}
};
