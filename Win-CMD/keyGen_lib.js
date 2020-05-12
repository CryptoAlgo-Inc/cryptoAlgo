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
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log('██████████████████████████████████████████████████████████████████');
    readline.question('█          Key in the key pair modulus length (1-50000)          █\n██████████████████████████████████████████████████████████████████\n', length => {
        if(!(/^[0-9]+$/.test(length))) {
            console.log('█     You have keyed in non-numarical characters. Exiting...     █');
            console.log('██████████████████████████████████████████████████████████████████');
            console.log('█              Thank you for using this program!                 █');
            console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
            setTimeout(function() {
                process.exit();
            }, 2500);
        }
        else {
            length = parseInt(length);
            if(length > 50000 | length <= 999 ) {
                console.log('█             Invalid length option. Exiting...                  █');
                console.log('██████████████████████████████████████████████████████████████████');
                console.log('█              Thank you for using this program!                 █');
                console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
                setTimeout(function() {
                    process.exit();
                }, 2500);
            }
            else {
                if(length > 6000) {
                    console.log('█       Please be patient. Generation might take a while.        █');
                }
                else if(length > 9999) {
                    console.log('█      Please be patient. Generation will take a long time.      █');
                    console.log('█              Process may appear non-responsive.                █');
                }
                console.log('█                  Generating RSA keypair...                     █');
                generateKeys(length);
                readline.close();
                console.log('█              Thank you for using this program!                 █');
                console.log('██████████████████████████████████████████████████████████████████\x1b[0m');
                setTimeout(function() {
                    process.exit();
                }, 2500);
            }
        }
    });
}
};