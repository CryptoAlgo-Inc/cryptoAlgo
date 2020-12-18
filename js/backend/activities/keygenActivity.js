function $(fID) { return document.getElementById(fID); }
function q(qur) { return document.querySelector(qur); }

function togglePWD(checkbox) {
    const i = document.querySelector('#keyPWD>input');
    if(checkbox.MDCCheckbox.checked) i.type = 'text';
    else i.type = 'password';
}

async function onStart() {
    console.log('<keygen> Started keygen activity');

    const snackbar = q('.mdc-snackbar').MDCSnackbar;

    function showSnackbar(text) {
        $('snackbarContent').textContent = text;
        snackbar.open();
    }

    $('genAll').onclick = function() {
        window.fileOps.filePick("Location to save AES keyfile",
            "AES Keyfile Name:", [], [{name: 'AES Keyfiles', extensions: ['.aKey']}])
            .then(promise => {
                if (promise.canceled) {
                    showSnackbar('File picker canceled, cannot continue generation. Please try again.');
                    return;
                }
                if (!window.cryptoFunc.AESKeygen(promise.filePath)){
                    showSnackbar(`Successfully generated AES keyfile. Saved location: '${promise.filePath}'`);
                    window.fileOps.filePick("Location to save RSA keypair","RSA keypair base name:", [],
                        [{name: "RSA Keypair", extensions: ['.pem']}])
                        .then(result => {
                            $('RSALen').MDCDialog.open()
                        });
                }
                else
                    showSnackbar('An error was encountered while generating AES keyfiles. Please try again later.')
            })
    }
}

function onStop() {
    console.log('<keygen> Detaching event listeners...');
    $('genAll').onclick = null;
    console.log('<keygen> Exiting keygen activity');
}