// Libraries for RSA encryption
const crypto = require('crypto')
const os = require('os')
const fs = require('fs')

function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
  const privateKey = fs.readFileSync(os.homedir() + '/Documents/private.pem', 'utf8')
  const buffer = Buffer.from(toDecrypt, 'hex')
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: '',
    },
    buffer,
  )
  return decrypted.toString('utf8')
}

module.exports = {
auto: function() {
    // Autoencrypt the data
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█ Welcome to the RSA decrypter written partially by Vincent Kwok █');
    console.log('█                         Decrypting...                          █');
    try {
        const enc_iv = fs.readFileSync(os.homedir() + '/Documents/enc_iv.txt', 'utf8');
        const enc_key = fs.readFileSync(os.homedir() + '/Documents/enc_key.txt', 'utf8');
    } catch(e) {
        console.log('Error encountered.');
        return true;
    }
    const enc_iv = fs.readFileSync(os.homedir() + '/Documents/enc_iv.txt', 'utf8');
    const enc_key = fs.readFileSync(os.homedir() + '/Documents/enc_key.txt', 'utf8');
    const key = decrypt(enc_key, 'private.pem');
    const iv = decrypt(enc_iv, 'private.pem');
    console.log('█                           Writing...                           █');
    fs.writeFileSync(os.homedir() + '/Documents/key.txt', key);
    fs.writeFileSync(os.homedir() + '/Documents/iv.txt', iv);
    console.log('█                            Done!                               █');
    console.log('█               Thank you for using the decryptor                █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
    return false;
}
};
