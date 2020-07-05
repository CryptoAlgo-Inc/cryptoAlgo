const { writeFileSync } = require('fs');
const os = require('os');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

module.exports = {
auto: function() {
    console.log('██████████████████████████████████████████████████████████████████');
    console.log('█              Generating random AES keyfiles...                 █');
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    console.log('Key: ', key);
    console.log('IV: ', iv);
    console.log('█                           Writing...                           █');
    writeFileSync(os.homedir() + '/Documents/key.txt', key.toString('hex'));
    writeFileSync(os.homedir() + '/Documents/iv.txt', iv.toString('hex'));
    console.log('█             Generation of AES keyfiles complete                █');
    console.log('█              Thank you for using this program!                 █');
    console.log('██████████████████████████████████████████████████████████████████');
}
};
