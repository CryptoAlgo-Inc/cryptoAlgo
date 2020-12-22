function $(fID) { return document.getElementById(fID); }
function q(qur) { return document.querySelector(qur); }

function showLoader(message = '') {
    const loaderDialog = $('loading-dialog').MDCDialog;
    // Disable closing dialog
    loaderDialog.scrimClickAction = ''; // Disable closing by clicking elsewhere
    loaderDialog.escapeKeyAction  = ''; // Disable closing by pressing escape key
    // Start indeterminable linear loading bar
    q('#loading-dialog .mdc-dialog__content .mdc-linear-progress').MDCLinearProgress.determinate = false;
    // Set text
    q('#loading-dialog .mdc-dialog__content p').textContent = message;
    loaderDialog.open(); // Open dialog
}

function stopLoader(reason = null) {
    // Stop progress bar
    q('#loading-dialog .mdc-dialog__content .mdc-linear-progress').MDCLinearProgress.determinate = true;
    $('loading-dialog').MDCDialog.close(reason); // Close dialog
}

function togglePWD(checkbox) {
    const i = document.querySelector('#keyPWD>input');
    if(checkbox.MDCCheckbox.checked) i.type = 'text';
    else i.type = 'password';
}

// Helper function to show snackbar
function showSnackbar(text, duration = 5000) {
    const snackbar = q('.mdc-snackbar').MDCSnackbar;
    snackbar.labelText = text;
    snackbar.timeoutMs = duration;
    snackbar.open();
}

// Generate AES keypair
function genAES(callback = function(_){}) { // Specify no callback
    window.fileOps.filePick("Location to save AES keyfile",
        "AES Keyfile Name:", [], [{name: 'AES Keyfiles', extensions: ['aKey']}])
        .then(promise => {
            if (promise.canceled) { // Cancel button was pressed
                showSnackbar('File picker canceled, AES keyfiles not generated. Please try again.');
                return;
            }
            if (!window.aesCrypto.keygen(promise.filePath)){
                showSnackbar(`Successfully generated AES keyfile. Saved location: '${promise.filePath}'`, 10000);
                callback(promise.filePath) // Provide saved location to callback
            }
            else
                showSnackbar('An error was encountered while generating AES keyfiles. Please try again later.');
        });
}

// Generate RSA keypair
function genRSA(callback = function(_){}) {
    const dialog = $('RSALen').MDCDialog;
    dialog.listen('MDCDialog:closed', function(action) {
        if (action.detail.action === 'continue') {
            // Get and verify RSA keypair length
            const len = parseInt($('RSAModLen').MDCTextField.value);

            if (!(4096 <= len && len <= 10240)) {
                showSnackbar('Keypair length is invalid. Please try generating RSA keypairs again.');
                console.error(`<keygen> Invalid RSA modulus length: '${len.toString()}'`);
                return;
            }

            window.fileOps.filePick("Location to save RSA keypair","RSA keypair base name:", [],
                [{name: "RSA Keypair", extensions: ['pem']}])
                .then(promise => {
                    if (promise.canceled) { // Cancel button was pressed
                        showSnackbar('File picker canceled, RSA keypair not generated. Please try again.');
                        return;
                    }

                    // Show loading dialog
                    showLoader('Generating RSA keypair, please wait. ' +
                        'This might take more than a minute depending on keypair length and your hardware.');

                    // Then start generation
                    window.rsaCrypto.keygen(
                        len,
                        $('keyPWD').MDCTextField.value,
                        promise.filePath,
                        function(retCode) {
                            // Stop loading dialog
                            stopLoader('Finished generating keyfiles');

                            if (retCode != null) {
                                console.error('<keygen> RSA keypair generation failed with exit code', retCode);
                                showSnackbar('Failed to write RSA keypair to specified location, check if permissions are sufficient.');
                                return;
                            }
                            console.log('<keygen> Done generating one RSA keypair');
                            callback(promise.filePath)
                        });
                });
        }
    });
    dialog.open();
}

async function onStart() {
    console.log('<keygen> Started keygen activity');

    $('genAll').onclick = function() {
        let $AESKeyfileLocation, $RSAKeypairLocation;
        genAES(function(savedLocation) {
            $AESKeyfileLocation = savedLocation;
            genRSA(function (keypairLocation) {
                $RSAKeypairLocation = keypairLocation;
            });
        }); // Generate AES and then generate RSA Keyfiles after generation completes
    };

    $('genRSA').onclick = () => { // Only generate RSA keypair
        genRSA();
    }

    $('genAES').onclick = () => { // Only generate AES keyfile
        genAES();
    }
}

function onStop() {
    console.log('<keygen> Detaching event listeners...');
    $('genAll').onclick = null;
    console.log('<keygen> Exiting keygen activity');
}