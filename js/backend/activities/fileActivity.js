function $(i) { return document.getElementById(i); }
function q(u) { return document.querySelector(u);  }

// Helper function to show snackbar
function showSnackbar(text, duration = 5000) {
    const snackbar = q('.mdc-snackbar').MDCSnackbar;
    snackbar.labelText = text;
    snackbar.timeoutMs = duration;
    snackbar.open();
}

async function onStart() {
    console.log('<fileCrypto> Started activity');

    // State vars
    let inFile  = null;
    let keyFile = null;
    let outFile = null;

    $('selInput').onclick = () => {
        window.fileOps.fileOpen("Select Input File",
            "Select File", ['openFile'], [
                {name: 'All Files', extensions: ['*']},
                {name: 'Encrypted Files', extensions: ['crypted']}
            ])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('File picker canceled');
                    return;
                }

                inFile = promise.filePaths[0];
                console.log('<fileCrypto> Selected input file', inFile);
            });
    }

    $('selKeyfile').onclick = () => {
        window.fileOps.fileOpen("Select AES Keyfile",
            "Select Keyfile", ['openFile'], [
                {name: 'AES Keyfiles', extensions: ['aKey']}
            ])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('File picker canceled');
                    return;
                }

                keyFile = promise.filePaths[0];
                console.log('<fileCrypto> Selected keyfile', keyFile);
            });
    }

    $('selOut').onclick = () => {
        window.fileOps.filePick("Select Output File","Output file name: ", [],
            [{name: "Output file", extensions: ['hm']}])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('File picker canceled');
                    return;
                }

                outFile = promise.filePath;
                console.log('<fileCrypto> Selected output file', outFile);
            });
    }

    $('encButton').onclick = () => {
        // Do the encryption
        if (inFile == null) {
            showSnackbar('Input file is not selected');
            return;
        }
        if (keyFile == null) {
            showSnackbar('Keyfile is not selected');
            return;
        }
        if (outFile == null) {
            showSnackbar('Output file is not selected');
            return;
        }

        window.fileCrypto.encrypt(inFile, outFile, keyFile).then((retVal) => {
            if (!retVal) {
                showSnackbar(`Successfully encrypted file ${inFile}`);
                console.debug('<fileCrypto:encrypt> Encrypted one file:', inFile, "Saved at:", outFile);
            }
            else {
                showSnackbar('Encryption of file failed. Please check that keyfiles are valid and input file is readable.');
            }
        });
    }

    $('decButton').onclick = () => {
        // Do the encryption
        if (inFile == null) {
            showSnackbar('Input file is not selected');
            return;
        }
        if (keyFile == null) {
            showSnackbar('Keyfile is not selected');
            return;
        }
        if (outFile == null) {
            showSnackbar('Output file is not selected');
            return;
        }

        window.fileCrypto.decrypt(inFile, outFile, keyFile).then((retVal) => {
            if (!retVal) {
                showSnackbar(`Successfully encrypted file ${inFile}`);
                console.debug('<fileCrypto:encrypt> Encrypted one file:', inFile, "Saved at:", outFile);
            }
            else {
                showSnackbar('Encryption of file failed. Please check that keyfiles are valid and input file is readable.');
            }
        });
    }
}

function onStop() {
    console.log('<fileCrypto> Stopped activity file');
}