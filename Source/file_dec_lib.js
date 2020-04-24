// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

const fs = require('fs');
const path = require('path')

function decrypt(text, key_in, iv_in) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key_in), iv_in);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = {
auto: function() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    var key_in;
    var iv_in;
    var key
    var iv;

    try {
        key_in = fs.readFileSync(path.resolve('key.txt'), 'utf8');
        iv_in = fs.readFileSync(path.resolve('IV.txt'), 'utf8');
        key = Buffer.from(key_in, 'hex');
        iv = Buffer.from(iv_in, 'hex');
    } catch(e) {
        console.log('Could not find or open the AES keyfiles. Please ensure that they are generated and not write protected.');
    }
    console.log('██████████████████████████████████████████████████████████████████');
    const listfiles = require('./listDir');
    file_list = listfiles.auto();        // List the files in dir to allow easy selection for user
    console.log('\x1b[32m██████████████████████████████████████████████████████████████████');
    readline.question('█   Key in the corrosponding number of the file to be decrypted  █\n', filenum => {
        // console.log('Key: ', key);
        // console.log('IV :', iv);
        try {
            if((parseInt(filenum) > 0) && (parseInt(filenum) <= file_list.length)){
                const file_in = fs.readFileSync(path.resolve(file_list[parseInt(filenum)]), 'utf8');
                const file_dec = decrypt(file_in, key, iv);
                fs.writeFileSync(('decrypted_' + file_list[parseInt(filenum)-1].slice(10, file_list[parseInt(filenum)-1].length)), file_dec);
                console.log('█                        Decrypting...                           █');
                console.log('Decrypted file has been saved as', ('"decrypted_' + (file_list[parseInt(filenum)-1].slice(10, file_list[parseInt(filenum)-1].length)) + '"'));
            }
            else {
                console.log('█                Please key in a valid number                    █');
                console.log('█             Thank you for using the decryptor!                 █');
                console.log('█         This windows will auto-close in 3.0 seconds.           █');
                console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
                readline.close();
                setTimeout(function() {
                    process.exit();
                }, 3000);
            }
        } catch(e) {
            console.log(e);
            console.log('\x1b[31m');
            console.log('Error while decrypting message. Ensure that the AES keyfiles are valid and the file is not corrupt.\x1b[32m');
            console.log('\x1b[0m');
        }
        console.log('█             Thank you for using the decryptor!                 █');
        console.log('█          This window will auto-close in 3.0 seconds.           █');
        console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
        readline.close();
        setTimeout(function() {
            process.exit();
        }, 2500);
    });
}
}