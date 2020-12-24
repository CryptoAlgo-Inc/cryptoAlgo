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

    const checkFilePaths = () => {
        const inPath = q('#in-file-path > .mdc-tooltip__surface');
        if (inFile == null) {
            inPath.textContent = 'No input file selected'
        }
        else {
            inPath.textContent = 'Selected input file: ' + inFile;
        }
        
        const keyPath = q('#keyfile-path > .mdc-tooltip__surface');
        if (keyFile == null) {
            keyPath.textContent = 'No keyfile selected';
        }
        else {
            keyPath.textContent = 'Selected keyfile: ' + keyFile;
        }

        const outPath = q('#out-file-path > .mdc-tooltip__surface');
        if (outFile == null) {
            outPath.textContent = 'No output file selected';
        }
        else {
            outPath.textContent = 'Selected output file: ' + outFile;
        }

        const encBtn = $('encButton');
        const decBtn = $('decButton');
        if (inFile && keyFile && outFile) {
            if (inFile.match(/\.crypted$/gm)) {
                decBtn.disabled = false;
                encBtn.disabled = true;
            }
            else {
                encBtn.disabled = false;
                decBtn.disabled = true;
            }
        }
        else {
            encBtn.disabled = true;
            decBtn.disabled = true;
        }
    }

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
                checkFilePaths();
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
                checkFilePaths();
                console.log('<fileCrypto> Selected keyfile', keyFile);
            });
    }

    $('selOut').onclick = () => {
        // We need to know the input file type first before selecting the output file
        if (inFile == null) {
            showSnackbar('Select the input file first');
            return;
        }

        let outputFormat, dialogLabel, dialogTitle;
        if (inFile.match(/\.crypted$/gm)) {
            outputFormat = {
                name: 'Decrypted File',
                extensions: [inFile.replace(/\.crypted$/gm, '').replace(/^.*\./gm, '')]
            }
            dialogLabel = 'Decrypted file name: ';
            dialogTitle = 'Select Decrypted File Location'
        }
        else {
            outputFormat = {
                name: 'Encrypted File',
                extensions: [inFile.replace(/^.*\./gm, '')]
            }
            dialogLabel = 'Encrypted file name: ';
            dialogTitle = 'Select Encrypted File Location (.crypted will be added to end of filename)'
        }

        console.log(outputFormat)

        window.fileOps.filePick(dialogTitle, dialogLabel, [],
            [outputFormat], inFile.replace(/(\..*)$/gm, ''))
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('File picker canceled');
                    return;
                }
                outFile = promise.filePath;

                if (!inFile.match(/\.crypted$/gm)) outFile = outFile  + '.crypted';

                checkFilePaths();
                console.log('<fileCrypto> Selected output file', outFile);
            });
    }

    $('encButton').onclick = () => {
        // Do the encryption

        window.fileCrypto.encrypt(inFile, outFile, keyFile).then((retVal) => {
            if (!retVal) {
                showSnackbar(`Encrypted file saved at: ${outFile}`);
                console.debug('<fileCrypto:encrypt> Encrypted one file:', inFile, "Saved at:", outFile);

                outFile = null;
                inFile  = null;
                checkFilePaths();
            }
            else {
                showSnackbar('Encryption of file failed. Please check that keyfiles are valid and input file is readable.');
            }
        });
    }

    $('decButton').onclick = () => {
        // Do the encryption

        window.fileCrypto.decrypt(inFile, outFile, keyFile).then((retVal) => {
            if (!retVal) {
                showSnackbar(`Decrypted file saved at: ${outFile}`);
                console.debug('<fileCrypto:encrypt> Decrypted one file:', inFile, "Saved at:", outFile);

                outFile = null;
                inFile  = null;
                checkFilePaths();
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