const { contextBridge, remote } = require('electron'); // Bridge some functions
const { dialog } = require('electron').remote;
const keygenAES  = require('./js/backend/lib/aes_keygen_lib.min');
const keygenRSA  = require('./js/backend/lib/keyGen_lib.min');
const encryptAES = require('./js/backend/lib/aes_encryptor_lib.min');
const decryptAES = require('./js/backend/lib/aes_decryptor_lib.min');
const fEncAES    = require('./js/backend/lib/file_enc_lib.min');
const fDecAES    = require('./js/backend/lib/file_dec_lib.min');
const RSAEncDec  = require('./js/backend/lib/encryptor_lib.min');

// Expose close, max- and mini-mise functions
const win = remote.getCurrentWindow();
contextBridge.exposeInMainWorld('winCtl', {
    close: () => { win.close(); },
    max: () =>
        {
            if (win.isFullScreen()) win.setFullScreen(false);
            else win.setFullScreen(true);
        },
    min: () => { win.minimize(); },
    restore: () => { win.unmaximize(); }
});
contextBridge.exposeInMainWorld('fileOps', {
    fileOpen: (customTitle, label, dialogOps, filter) => { // High risk function
        return dialog.showOpenDialog(win, {
            title: customTitle,   // Window title for Windows
            message: customTitle, // Selector window title for macOS
            properties: dialogOps,
            filters: filter,
            buttonLabel: label
        });
    },
    filePick: (customTitle, label, ops, filter, defName='Untitled') => {
        return dialog.showSaveDialog(win, {
            title: customTitle,
            message: customTitle,
            nameFieldLabel: label,
            properties: ops,
            filters: filter,
            defaultPath: defName
        })
    }
});
// AES operations
contextBridge.exposeInMainWorld('aesCrypto', {
    keygen: (filename) => { // Generate AES keyfiles
        return keygenAES.gen(filename);
    },
    encrypt: (plainText, loc) => {
        return encryptAES.encrypt(plainText, loc);
    },
    decrypt: (cipher, iv, loc) => {
        return decryptAES.decrypt(cipher, iv, loc);
    }
});
contextBridge.exposeInMainWorld('fileCrypto', {
    encrypt: (fileIn, fileOut, key) => {
        return fEncAES.encrypt(fileIn, fileOut, key);
    },
    decrypt: (fileIn, fileOut, key) => {
        return fDecAES.decrypt(fileIn, fileOut, key);
    }
});
// RSA operations
contextBridge.exposeInMainWorld('rsaCrypto', {
    keygen: (len, pwd, loc, cb) => { // Generate AES keyfiles
        return keygenRSA.gen(len, pwd, loc, cb);
    },
    encrypt: (pub, aes, out) => {
        return RSAEncDec.encrypt(pub, aes, out);
    },
    decrypt: (pub, pwd, aes, out) => {
        return RSAEncDec.decrypt(pub, pwd, aes, out);
    }
});
// System info
contextBridge.exposeInMainWorld('proInfo', {
    platform: () => { // Get platform
        return process.platform;
    }
});

require('electron')