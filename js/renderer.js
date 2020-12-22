// Modules
import {html, render} from '../lit-html/lit-html.js' // Import lit-html

// Constants
const $textID = 'text';
const $fileID = 'file';
const $keyGenID = 'keygen';
const $RSA_ID = 'RSA';

// State vars
let prevTabID = null;

// App bar actions
const minimise = function() {
    window.winCtl.min();
};
const maximise = function() {
    window.winCtl.max();
};
const close = function() {
    window.winCtl.close();
};

const keyGenInflate = function() {
    renderTab(keyGen, $keyGenID, 'Keyfile generation');
};
const textInflate = function() {
    renderTab(text, $textID, 'Text cryptography');
};
const fileInflate = function() {
    renderTab(file, $fileID, 'File cryptography');
};
const RSAInflate = function() {
    renderTab(RSA, $RSA_ID, 'RSA cryptography');
};

// Utility functions
const $ = (id) => document.getElementById(id);
const q = (selector) => document.querySelector(selector);
const store = (key, data) => localStorage.setItem(key, data);
const get   = (key) => localStorage.getItem(key);
const clrActive = () => {
    document.querySelectorAll('.titleBar .titleTabs button').forEach(element => {
        element.classList.remove('active');
    });
}
// Render a tab into content area
const renderTab = (tabRenderer, tabID, longName) => {
    if (tabID === prevTabID) return // Don't continue if the tab is the same as the previous
    // ------
    if (typeof onStop === "function") { // Check if there was a previous activity
        console.debug(`<renderTab> Stopping activity ${prevTabID}`);
        try {onStop();}
        catch (e) {
            console.warn(`<renderTab> Activity onStop threw an exception:\n\n${e}`);
        }
    }
    // ------
    // Update title UI and render fragment
    q('.titleBar .windowTitle small').textContent = longName;
    render(tabRenderer(), $('main'));
    // ------
    // Init material components
    window.mdc.autoInit();
    // ------
    // Store latest tab and update tab UI
    store('lastTab', tabID);
    clrActive();
    // ------
    // Load activity script
    console.debug(`<renderTab> Loading activity ${tabID}`);
    loadJS(`js/backend/activities/${tabID}Activity.min.js`, function() {
        onStart().then(() => {
            console.debug(`<renderTab> Loaded activity ${tabID}`)
        }).catch(e => {
            console.warn(`<renderTab> ${tabID} activity onStart threw an exception:\n\n ${e}`)
        })
    }).catch(e => {
        console.debug(`<renderTab> Failed to fetch and execute activity JS script for activity ${tabID} with error:\n\n${e}`)
    });
    // ------
    prevTabID = tabID
    $(tabID).classList.add('active');
}
// Programmatically load JS into DOM
const loadJS = async (src, callback = function() { console.debug(`Loaded script '${src}`) }) => {
    const script = document.createElement('script');
    script.onload = callback
    script.src = src;

    try {
        document.head.appendChild(script); // Add to DOM
    }
    catch(e) {
        console.error(`Failed to fetch script '${src}' with error: \n\n${e}`);
    }
}

// Page template
const page = () => html`
    <div class="titleBar">
        <div class="buttonHolder">
            <button aria-label="Close" class="close" @click=${close}></button>
            <button aria-label="Minimise" class="minimise" @click=${minimise}></button>
            <button aria-label="Maximise" class="maximise" @click=${maximise}></button>
        </div>
        <div class="windowTitle">
            <p>CryptoAlgo</p>
            <small>Loading...</small>
        </div>
        <div class="titleTabs">
            <button @click=${keyGenInflate} id="${$keyGenID}">Keys</button>
            <button @click=${textInflate} id="${$textID}">Text</button>
            <button @click=${fileInflate} id="${$fileID}">File</button>
            <button @click=${RSAInflate} id="${$RSA_ID}">RSA</button>
        </div>
        <div class="titleActions">
            
        </div>
    </div>
    <!------>
    <div class="mdc-snackbar" data-mdc-auto-init="MDCSnackbar">
        <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
            <div class="mdc-snackbar__label" aria-atomic="false" id="snackbarContent">
                No content
            </div>
        </div>
    </div>
    <!------>
    <div class="content">
        <main id="main">
        </main>
    </div>
`;

// AES/RSA key generation
const keyGen = () => html`
    <!------>
    <!-- Loading dialog for RSA generation -->
    <div class="mdc-dialog" id="loading-dialog" data-mdc-auto-init="MDCDialog">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
                 role="alertdialog"
                 aria-modal="true"
                 aria-labelledby="loader-dialog-title"
                 aria-describedby="loader-content">
                <!------>
                <h2 class="mdc-dialog__title" id="loader-dialog-title">Please wait...</h2>
                <!------>
                <div class="mdc-dialog__content" id="loader-content">
                    <p></p> <!-- Loading text, added by JS later -->
                    <!------>
                    <!-- MDC Linear Progress Bar -->
                    <div role="progressbar" class="mdc-linear-progress" aria-label="Please wait..." 
                         data-mdc-auto-init="MDCLinearProgress"
                         tabindex="0"
                         aria-valuemin="0" 
                         aria-valuemax="1" 
                         aria-valuenow="0">
                        <div class="mdc-linear-progress__buffer">
                            <div class="mdc-linear-progress__buffer-bar"></div>
                            <div class="mdc-linear-progress__buffer-dots"></div>
                        </div>
                        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                            <span class="mdc-linear-progress__bar-inner"></span>
                        </div>
                        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                            <span class="mdc-linear-progress__bar-inner"></span>
                        </div>
                    </div>
                    <!------>
                </div>
            </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
    </div>
    <!------>
    <!-- RSA keyfile generation dialog -->
    <div class="mdc-dialog" id="RSALen" data-mdc-auto-init="MDCDialog">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
                 role="alertdialog"
                 aria-modal="true"
                 aria-labelledby="rsa-dialog-title"
                 aria-describedby="rsa-dialog-content">
                <!------>
                <h2 class="mdc-dialog__title" id="rsa-dialog-title">RSA Keypair Options</h2>
                <!------>
                <div class="mdc-dialog__content" id="rsa-dialog-content">
                    <p>
                        If you are unsure about any options, use the default value.
                    </p>
                    <!--- Text Field --->
                    <label class="mdc-text-field mdc-text-field--outlined" data-mdc-auto-init="MDCTextField" 
                           id="RSAModLen">
                        <span class="mdc-notched-outline">
                            <span class="mdc-notched-outline__leading"></span>
                            <span class="mdc-notched-outline__notch">
                                <span class="mdc-floating-label mdc-floating-label--float-above" id="lenLabel">
                                    RSA Modulus Length (4096 - 10240)
                                </span>
                            </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <input type="number" class="mdc-text-field__input" aria-labelledby="lenLabel" value="8192"
                        min="4096" max="81920">
                    </label>
                    <div class="mdc-text-field-helper-line">
                        <div id="username-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" >
                            Length of keypair, in bits, to generate. Encryption time and security is directly proportional to the length.
                        </div>
                    </div>
                    <!------>
                    <!--- Password Field --->
                    <label class="mdc-text-field mdc-text-field--outlined" data-mdc-auto-init="MDCTextField" style="margin-top:15px" 
                           id="keyPWD">
                        <span class="mdc-notched-outline">
                            <span class="mdc-notched-outline__leading"></span>
                            <span class="mdc-notched-outline__notch">
                                <span class="mdc-floating-label mdc-floating-label--float-above" id="pwdLabel">
                                    Private Key Password
                                </span>
                            </span>
                            <span class="mdc-notched-outline__trailing"></span>
                        </span>
                        <input type="password" class="mdc-text-field__input" aria-labelledby="pwdLabel">
                    </label>
                    <div class="mdc-text-field-helper-line">
                        <div id="username-helper-text" class="mdc-text-field-helper-text" aria-hidden="true" >
                            Empty: no password. If a password is set, the private key can only be used with this password.
                        </div>
                    </div>
                    <!------>
                    <!--- Super long markup just for one checkbox -->
                    <div class="mdc-form-field" data-mdc-auto-init="MDCFormField">
                        <div class="mdc-checkbox" data-mdc-auto-init="MDCCheckbox" 
                             onclick="togglePWD(this)">
                            <input type="checkbox" 
                                   class="mdc-checkbox__native-control"
                                   id="showPWD"/>
                            <div class="mdc-checkbox__background">
                                <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                    <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                                </svg>
                                <div class="mdc-checkbox__mixedmark"></div>
                            </div>
                            <div class="mdc-checkbox__ripple"></div>
                        </div>
                        <label for="showPWD">Show Password</label>
                    </div>
                    <!------>
                    <p>
                        After clicking on continue, you'll be prompted for a location to save the keypair.<br>
                        The private key will have a '-pri' added to the filename, and '-pub' to the public key.
                    </p>
                </div>
                <!------>
                <div class="mdc-dialog__actions">
                    <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Cancel</span>
                    </button>
                    <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="continue">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Continue</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
    </div>
    <!------>
    <div class="mount">
        <h2>AES/RSA Key Generation</h2>
        <small class="mdc-typography--body2">
            Keyfiles are like keys for your data. Keep your keyfiles in a secure location, and treat them like keys.
            If you lose them, any data encrypted with them will be permanently lost.
        </small>
        <!------>
        <div>
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" style="margin:4px">
                <div class="mdc-button__ripple"></div>
                <i class="material-icons mdc-button__icon" aria-hidden="true">help</i>
                <span class="mdc-button__label">Learn more about AES keyfiles</span>
            </button>
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" style="margin:4px">
                <div class="mdc-button__ripple"></div>
                <i class="material-icons mdc-button__icon" aria-hidden="true">help</i>
                <span class="mdc-button__label">Learn more about RSA keypairs</span>
            </button>
        </div>
        <!------>
        <hr>
        <!------>
        <div class="inner">
            <p class="mdc-typography--body1">
                Just starting, or don't know what to do? 
                Click the button below to generate all required keyfiles in one step, quickly and easily.
            </p>
            <button class="mdc-button mdc-button--raised" data-mdc-auto-init="MDCRipple" id="genAll">
                <div class="mdc-button__ripple"></div>
                <i class="material-icons mdc-button__icon">vpn_key</i>
                <span class="mdc-button__label">Generate all keyfiles</span>
            </button>
            <!------>
            <h3>Advanced Options</h3>
            <small class="mdc-typography--body2">
                Use these functions if you want to regenerate one keyfile, or have other special requirements.
            </small>
            <hr>
            <p class="mdc-typography--body1">
                Only generate a AES keyfile
            </p>
            <button class="mdc-button mdc-button--outlined" data-mdc-auto-init="MDCRipple" id="genAES">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Generate AES keyfile</span>
            </button>
            <p class="mdc-typography--body1">
                Only generate a RSA keypair
            </p>
            <button class="mdc-button mdc-button--outlined" data-mdc-auto-init="MDCRipple" id="genRSA">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Generate RSA keypair</span>
            </button>
        </div>

    </div>
`;
// Text enc/dec stub
const text = () => html`
    <div class="mount">
        <!------>
        <!--- Tab bar --->
        <div class="mdc-tab-bar" role="tablist" data-mdc-auto-init="MDCTabBar" style="margin-left:-20px;width:100vw;margin-top:-10px">
            <div class="mdc-tab-scroller">
                <div class="mdc-tab-scroller__scroll-area">
                    <div class="mdc-tab-scroller__scroll-content">
                        <!------>
                        <button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0" id="tab_enc">
                            <span class="mdc-tab__content">
                                <span class="mdc-tab__icon material-icons" aria-hidden="true">lock</span>
                                <span class="mdc-tab__text-label">Encrypt</span>
                            </span>
                            <span class="mdc-tab-indicator mdc-tab-indicator--active">
                                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                            <span class="mdc-tab__ripple"></span>
                        </button>
                        <!------>
                        <button class="mdc-tab" role="tab" aria-selected="false" tabindex="-1" id="tab_dec">
                            <span class="mdc-tab__content">
                                <span class="mdc-tab__icon material-icons" aria-hidden="true">lock_open</span>
                                <span class="mdc-tab__text-label">Decrypt</span>
                            </span>
                            <span class="mdc-tab-indicator">
                                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                            <span class="mdc-tab__ripple"></span>
                        </button>
                        <!------>
                    </div>
                </div>
            </div>
        </div>
        <!------>
        <!-- Content switcher -->
        <div class="contentSwitcher contentSwitcher__tabs_2">
            <!-- Tab 1 (Encrypt) -->
            <div class="contentSwitcher__content" id="encryptContent">
                <h2>Text Encryption</h2>
                <label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea" 
                       data-mdc-auto-init="MDCTextField">
                    <span class="mdc-text-field__ripple"></span>
                    <span class="mdc-floating-label" id="my-label-id">Text to encrypt: </span>
                    <span class="mdc-text-field__resizer">
                        <textarea class="mdc-text-field__input" rows="8" cols="40" aria-label="Label"
                                  aria-labelledby="my-label-id"></textarea>
                    </span>
                    <span class="mdc-line-ripple"></span>
                </label>
            </div>
            <!-- Tab 2 (Decrypt -->
            <div class="contentSwitcher__content contentSwitcher-outRight hidden" id="decryptContent">
                <h2>Text Decryption</h2>
            </div>
        </div>
    </div>
`;
// File stub
const file = () => html`
    <div class="mount">
        <h2>File Encryption/Decryption</h2>
    </div>
`;
// RSA stub
const RSA = () => html`
    <div class="mount">
        <h2>Encrypt/Decrypt AES Keyfiles With RSA</h2>
    </div>
`;

// Render the template to the document
render(page(), document.body); // Render content
document.title = 'CryptoAlgo'

// Then search for the last used tab
const lastTab = get('lastTab');
switch (lastTab) {
    case $textID:
        textInflate();
        break;
    case $fileID:
        fileInflate();
        break;
    case $RSA_ID:
        RSAInflate();
        break;
    case $keyGenID:
        keyGenInflate();
        break;
    default:
        keyGenInflate();
}