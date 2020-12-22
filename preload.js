const { contextBridge, remote } = require('electron'); // Bridge some functions
const { dialog } = require('electron').remote;
const keygenAES  = require('./js/backend/lib/aes_keygen_lib.min');
const keygenRSA  = require('./js/backend/lib/keyGen_lib.min');
const encryptAES = require('./js/backend/lib/aes_encryptor_lib.min');

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
    filePick: (customTitle, label, ops, filter) => {
        return dialog.showSaveDialog(win, {
            title: customTitle,
            message: customTitle,
            nameFieldLabel: label,
            properties: ops,
            filters: filter
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
    }
});
// RSA operations
contextBridge.exposeInMainWorld('rsaCrypto', {
    keygen: (len, pwd, loc, cb) => { // Generate AES keyfiles
        return keygenRSA.gen(len, pwd, loc, cb);
    }
});

require('electron')