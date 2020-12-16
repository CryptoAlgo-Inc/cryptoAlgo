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
        onStop();
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
            console.debug(`<renderTab> Activity onStart threw an exception:\n\n ${e}`)
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
    <div class="content">
        <main id="main">
        </main>
    </div>
`;

// AES/RSA key generation
const keyGen = () => html`
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
            <button class="mdc-button mdc-button--raised" data-mdc-auto-init="MDCRipple">
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
            <button class="mdc-button mdc-button--outlined" data-mdc-auto-init="MDCRipple">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Generate AES keyfile</span>
            </button>
            <p class="mdc-typography--body1">
                Only generate a RSA keypair
            </p>
            <button class="mdc-button mdc-button--outlined" data-mdc-auto-init="MDCRipple">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Generate RSA keypair</span>
            </button>
        </div>

    </div>
`;
// Text enc/dec stub
const text = () => html`
    <div class="mount">
        <h2>Text Encryption/Decryption</h2>
        <div class="step step-1">
            
        </div>
        <div class="step step-2">
            
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