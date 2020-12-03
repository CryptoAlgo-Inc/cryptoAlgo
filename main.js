// Electron main proc
const contextMenu = require('electron-context-menu');
const path = require('path');

const { app, BrowserWindow, session } = require('electron');

contextMenu({
    showInspectElement: false
});

app.allowRendererProcessReuse = true;

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 350,
        minHeight: 500,
        backgroundColor: '#000',
        frame: false,
        show: false,
        maximizable: true,
        webPreferences: {
            spellcheck: true,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), 'preload.js')
        },
    });
    win.setMenuBarVisibility(false); // Remove menu bar

    // Fake httpReferer to allow playing of youtube videos
    win.webContents.session.webRequest.onBeforeSendHeaders({ urls: [ "*://*/*" ] }, (details, callback) => {
        callback({
            requestHeaders: {
                ...details.requestHeaders,
                Referer: 'https:/ /www.youtube-nocookie.com',
            }
        });
    });

    // Also remove CORS and iFrame options
    win.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
        (d, c)=>{
            if(d.responseHeaders['X-Frame-Options']){
                delete d.responseHeaders['X-Frame-Options'];
            } else if(d.responseHeaders['x-frame-options']) {
                delete d.responseHeaders['x-frame-options'];
            }

            c({cancel: false, responseHeaders: d.responseHeaders});
        }
    );

    win.loadFile('index.html').catch(e => console.error(e));
    win.once('ready-to-show', () => {
        win.show();
    })
}

app.whenReady().then(createWindow);

// Manage macOS window behaviour
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})