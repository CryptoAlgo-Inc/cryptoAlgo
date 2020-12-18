const { contextBridge, remote } = require('electron'); // Bridge some functions
const { dialog } = require('electron').remote;
const keygenAES  = require('./js/backend/lib/aes_keygen_lib');

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
    fileOpen: (customTitle, dialogOps) => { // High risk function
        return dialog.showOpenDialog(win, {
            title: customTitle,   // Window title for Windows
            message: customTitle, // Selector window title for macOS
            properties: dialogOps
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
contextBridge.exposeInMainWorld('cryptoFunc', {
    AESKeygen: (filename) => { // High risk function
        return keygenAES.gen(filename);
    }
});

require('electron')