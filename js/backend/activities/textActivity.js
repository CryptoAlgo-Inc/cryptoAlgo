function $(i) { return document.getElementById(i); }
function q(u) { return document.querySelector(u);  }

window.prevTimeOut = null;

function hideAfterDelay(elem, delay) {
    if (window.prevTimeOut != null) {
        clearTimeout(prevTimeOut);
        window.prevTimeOut = null;
    }
    window.prevTimeOut = setTimeout(() => {
        elem.classList.add('hidden');
        window.prevTimeOut = null;
    }, delay)
}

// Helper function to show snackbar
function showSnackbar(text, duration = 5000) {
    const snackbar = q('.mdc-snackbar').MDCSnackbar;
    snackbar.labelText = text;
    snackbar.timeoutMs = duration;
    snackbar.open();
}

async function onStart() {
    console.log('<textCrypto> Started activity text');

    // State vars
    // Keep encryption and decryption keyfiles separate in case the user wants to use diff keyfiles
    let encKeyfilePath = null;
    let decKeyfilePath = null;

    // Handle tab switching
    const tabs = q('.mdc-tab-bar').MDCTabBar;
    tabs.listen('MDCTabBar:activated', function(data) {
        console.debug(`<textCrypto:TabBar> Tab selected: ${data.detail.index}`);

        // Content holders
        const encryptContent = $('encryptContent');
        const decryptContent = $('decryptContent');

        // Select correct content and animate switching
        switch (data.detail.index) {
            case 0:
                console.debug(`<textCrypto:TabBar> Content: Encrypt`);
                encryptContent.classList.remove('hidden');
                encryptContent.classList.remove('contentSwitcher-outLeft');
                decryptContent.classList.add('contentSwitcher-outRight');

                hideAfterDelay(decryptContent, 250); // To prevent resizing issues
                break;
            case 1:
                console.debug(`<textCrypto:TabBar> Content: Decrypt`);
                decryptContent.classList.remove('hidden');
                encryptContent.classList.add('contentSwitcher-outLeft');
                decryptContent.classList.remove('contentSwitcher-outRight');

                hideAfterDelay(encryptContent, 250);
                break;
            default:
                console.error(`<textCrypto:TabBar> Unknown tab selected!`);
        }
    });

    // Add onclick listeners
    // Select keyfile button
    $('enc-open-keyfile').onclick = async () => {
        window.fileOps.fileOpen("Select AES Keyfile",
            "Select Keyfile", ['openFile'], [{name: 'AES Keyfiles', extensions: ['aKey']}])
            .then(promise => {
                if (promise.canceled) return;

                console.log(`<textCrypto> Selected one keyfile: ${promise.filePaths}`);
                encKeyfilePath = promise.filePaths[0];
                // Update selected file text
                $('enc-selected-key').textContent =
                    `Currently selected keyfile: '${encKeyfilePath.replace(/^.*\//gm, '')}'`;
            });
    };
    $('dec-open-keyfile').onclick = async () => {
        window.fileOps.fileOpen("Select AES Keyfile",
            "Select Keyfile", ['openFile'], [{name: 'AES Keyfiles', extensions: ['aKey']}])
            .then(promise => {
                if (promise.canceled) return;

                console.log(`<textCrypto> Selected one keyfile: ${promise.filePaths}`);
                decKeyfilePath = promise.filePaths[0];
                $('dec-selected-key').textContent =
                    `Currently selected keyfile: '${decKeyfilePath.replace(/^.*\//gm, '')}'`;
            });
    };

    const encHandler = (text, silent = false) => {
        if (text.length === 0) {
            if (!silent) showSnackbar('Text to encrypt is blank');
            return;
        }

        if (encKeyfilePath == null) {
            if (!silent) showSnackbar('No keyfile selected. Select one above or generate a new one.');
            return;
        }

        // Carry out the encryption
        window.aesCrypto.encrypt(text, encKeyfilePath).then((retVal) => {
            const encryptOutput = $('encrypted-output');
            if (retVal.err != null) {
                console.warn(`<aesCrypto:encrypt> Error encrypting text: \n\n${retVal.err}`);
                showSnackbar('Failed to encrypt text. Check if keyfiles are valid.');
                encryptOutput.innerHTML = '<i>Encryption failure</i>'
                return;
            }
            encryptOutput.textContent = retVal.cipher + retVal.iv;
        });
    }

    // Encrypt text button
    const encBtn = $('startEnc');
    encBtn.onclick = () => {
        const plainText = $('text-to-enc').MDCTextField.value.trim();
        encHandler(plainText);
    };

    // Decrypt text function
    $('startDec').onclick = () => {
        const cipher = $('cipher-text').MDCTextField.value.trim();
        if (cipher.length === 0) {
            showSnackbar('Text to decrypt is blank');
            return;
        }

        if (decKeyfilePath == null) {
            showSnackbar('No keyfile selected.');
            return;
        }

        // Carry out the encryption
        window.aesCrypto.decrypt(cipher.slice(0, -24), cipher.slice(-24), decKeyfilePath).then((retVal) => {
            const decryptOutput = $('decrypted-output');
            if (retVal.err != null) {
                console.warn(`<aesCrypto:decrypt> Error decrypting text: \n\n${retVal.err}`);
                showSnackbar('Failed to decrypt text. Check if keyfiles are valid and were also used to encrypt the text.');
                decryptOutput.innerHTML = '<i>Decryption failure</i>'
                return;
            }
            decryptOutput.textContent = retVal.text;
        });
    }

    // Text output click
    document.querySelectorAll('.output-area').forEach((elem) => {
        elem.onclick = (element) => {
            console.debug('<textCrypto:outputArea@click> Copied text:', element.target.textContent.trim().slice(0, 10), '...');
            window.navigator.clipboard.writeText(element.target.textContent.trim());
            showSnackbar('Copied text to clipboard');
        }
    });

    // Checkbox event listener
    const instCheckbox = $('inst-enc');
    let prevText = ''; // Prevent repetition of input like when space is pressed
    instCheckbox.onchange = () => {
        if (instCheckbox.checked) {
            // Disable encrypt button
            encBtn.disabled = true;
            const textField = $('text-to-enc').MDCTextField;
            encHandler(textField.value.trim(), true);

            q('#text-to-enc textarea').oninput = () => {
                const newText = $('text-to-enc').MDCTextField.value.trim();
                if (newText === prevText) return;
                encHandler(textField.value.trim(), true);
                prevText = newText;
            }
        }
        else {
            encBtn.disabled = false;
            q('#text-to-enc textarea').oninput = null;
        }
    }
}

function onStop() {
    console.debug('<textCrypto> Deleting global vars...');
    delete window.prevTimeOut;
    console.log('<textCrypto> Stopped activity text');
}