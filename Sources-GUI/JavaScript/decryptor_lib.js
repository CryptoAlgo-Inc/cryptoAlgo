// Libraries for RSA encryption
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
  const privateKey = fs.readFileSync(absolutePath, 'utf8')
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
        const enc_iv = fs.readFileSync(path.resolve('enc_iv.txt'), 'utf8');
        const enc_key = fs.readFileSync(path.resolve('enc_key.txt'), 'utf8');
    } catch(e) {
        console.log('Error encountered.');
        return true;
    }
    const enc_iv = fs.readFileSync(path.resolve('enc_iv.txt'), 'utf8');
    const enc_key = fs.readFileSync(path.resolve('enc_key.txt'), 'utf8');
    const key = decrypt(enc_key, 'private.pem');
    const iv = decrypt(enc_iv, 'private.pem');
    console.log('█                           Writing...                           █');
    fs.writeFileSync('key.txt', key);
    fs.writeFileSync('iv.txt', iv);
    console.log('█                            Done!                               █');
    console.log('█               Thank you for using the decryptor                █');
    console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
    return false;
}
};