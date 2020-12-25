function $(fID) { return document.getElementById(fID); }
function q(qur) { return document.querySelector(qur); }

// Helper function to show snackbar
function showSnackbar(text, duration = 5000) {
    const snackbar = q('.mdc-snackbar').MDCSnackbar;
    snackbar.labelText = text;
    snackbar.timeoutMs = duration;
    snackbar.open();
}

async function onStart() {
    console.log('<RSA-Activity> Started activity RSA');

    // File paths
    let RSAKeyPath = null;
    let AESKeyPath = null;
    let outFileLoc = null;

    const updateFilePaths = () => {
        const keyPathElem = $('selected-keyfile');
        if (RSAKeyPath != null) keyPathElem.textContent = 'Selected keyfile: ' + RSAKeyPath;
        else keyPathElem.textContent = 'No selected keyfile';

        const AESPathElem = $('AESLoc');
        if (AESKeyPath != null) AESPathElem.textContent = 'Selected AES keyfile: ' + AESKeyPath;
        else AESPathElem.textContent = 'No AES keyfile selected';

        const outLocElem = $('outLoc');
        if (outFileLoc != null) outLocElem.textContent = 'Selected output location: ' + outFileLoc;
        else outLocElem.textContent = 'No output location selected';

        if (RSAKeyPath && AESKeyPath && outFileLoc) {
            const encBtn = $('encButton');
            const decBtn = $('decButton');

            if (AESKeyPath.match(/\.aKey$/gm)) {
                encBtn.disabled = false;
                decBtn.disabled = true;
            }
            else {
                encBtn.disabled = true;
                decBtn.disabled = false;
            }
        }
    }

    $('selKeyfile').onclick = () => {
        window.fileOps.fileOpen("Select RSA Keyfile",
            "Select Keyfile", ['openFile'], [{name: "RSA Keypair", extensions: ['pem']}])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('RSA keypair file picker canceled');
                    return;
                }

                RSAKeyPath = promise.filePaths[0];
                updateFilePaths();
                console.log('<RSA-Activity> Selected RSA keyfile:', RSAKeyPath);
            });
    }
    $('selAESKeyfile').onclick = () => {
        window.fileOps.fileOpen("Select encrypted/decrypted AES Keyfile",
            "Select Keyfile", ['openFile'], [
                {name: "AES Keyfile", extensions: ['aKey']},
                {name: "Encrypted AES Keyfile", extensions: ['cryptKey']}
            ])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('RSA keypair file picker canceled');
                    return;
                }

                AESKeyPath = promise.filePaths[0];
                updateFilePaths();
                console.log('<RSA-Activity> Selected RSA keyfile:', RSAKeyPath);
            });
    }
    $('selOutLoc').onclick = () => {
        if (AESKeyPath == null) {
            showSnackbar('Select the input AES keyfile first.');
            return;
        }

        let outputFormat;
        if (AESKeyPath.match(/\.aKey$/gm)) {
            outputFormat = {name: "Encrypted AES Keyfile", extensions: ['cryptKey']};
        }
        else outputFormat = {name: "Decrypted AES Keyfile", extensions: ['aKey']};

        window.fileOps.filePick('Select location to save output file', 'Output file name: ', [],
            [outputFormat], AESKeyPath.replace(/(\..*)$/gm, ''))
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('Output file picker canceled');
                    return;
                }

                outFileLoc = promise.filePath;
                updateFilePaths();
                console.log('<RSA-Activity> Selected RSA keyfile:', RSAKeyPath);
            });
    }

    $('encButton').onclick = () => {
        window.rsaCrypto.encrypt(RSAKeyPath, AESKeyPath, outFileLoc).then((result) => {
            if (result) {
                showSnackbar('Failed to encrypt AES keyfile. Check if public key is selected and valid.');
                return;
            }

            showSnackbar('Encrypted AES keyfile saved at: ' + outFileLoc);
        }).catch((e) => {
            console.warn('<RSA-Activity:encrypt> Uncaught error from module:\n\n', e);
            showSnackbar('Failed to encrypt AES keyfile. Check if files are readable.');
        });
    }
    $('decButton').onclick = () => {
        window.rsaCrypto.decrypt(RSAKeyPath, $('priPWD').MDCTextField.value, AESKeyPath, outFileLoc).then((result) => {
            if (result) {
                showSnackbar('Failed to decrypt AES keyfile. Check if private key is selected, valid and password is correct.', 6000);
                return;
            }

            showSnackbar('Decrypted AES keyfile saved at: ' + outFileLoc);
        }).catch((e) => {
            console.warn('<RSA-Activity:decrypt> Uncaught error from module:\n\n', e);
            showSnackbar('Failed to decrypt AES keyfile. Check if files are readable.');
        });
    }
}

function onStop() {
    console.log('<RSA-Activity> Exited activity RSA');
}