const { contextBridge, remote, dialog } = require('electron'); // Bridge some functions

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
    restore: () => { win.unmaximize(); },
    filePicker: (any) => { // High risk function
        return dialog.showOpenDialog({ properties: ['openFile'] });
    }
})