decrypt = require('./cont_decryptor');
encrypt = require('./cont_encryptor');
header_decrypt = require('./Decryptor_lib');

module.exports = {
    auto: function(callback) {
        // This is just a launcher
        console.log('██████████████████████████████████████████████████████████████████');
        console.log('█              Input "exit" to exit from the program             █');
        // console.log('██████████████████████████████████████████████████████████████████');
        try {
            header_decrypt.auto(false);
        } catch(e) {
            console.log('█   Error decrypting the AES keys. Please ensure the encrypted   █');
            console.log('█        AES keys are present and the RSA keys are valid.        █');
            console.log('██████████████████████████████████████████████████████████████████');
            console.log('█              Thank you for using this program!                 █');
            console.log('██████████████████████████████████████████████████████████████████');
            setTimeout(function() {
                process.exit();
            }, 5000);
        }
        try {
            encrypt.auto(callback);
        } catch(e) {
            console.log('\x1b[31m█            Is the RSA keypair present and valid?              █\x1b[0m');
            callback();
        }
    }
}