const { contextBridge, remote } = require('electron'); // Bridge some functions
const { dialog } = require('electron').remote;

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
    filePicker: (customTitle, dialogOps) => { // High risk function
        return dialog.showOpenDialog(win, {
            title: customTitle,   // Window title for Windows
            message: customTitle, // Selector window title for macOS
            properties: dialogOps
        });
    }
});

require('electron')