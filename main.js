// Electron main proc
const contextMenu = require('electron-context-menu');

if(require('electron-squirrel-startup')) return;

const { app, BrowserWindow, Menu, shell } = require('electron');

contextMenu({
    showInspectElement: false
});

const isMac = process.platform === 'darwin'; // True if running on macOS
app.allowRendererProcessReuse = true;

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 450,
        minHeight: 200,
        backgroundColor: '#000',
        frame: false,
        show: false,
        icon: __dirname + '/cryptoalgo.png',
        maximizable: true,
        webPreferences: {
            spellcheck: true,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: __dirname + '/preload.js',
            devTools: false
        },
    });
    win.setMenuBarVisibility(false); // Remove menu bar

    // Fake httpReferer to allow playing of youtube videos
    win.webContents.session.webRequest.onBeforeSendHeaders({ urls: [ "*://*/*" ] }, (details, callback) => {
        callback({
            requestHeaders: {
                ...details.requestHeaders,
                Referer: 'https://www.youtube-nocookie.com',
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
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Override system menu bar
const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    await shell.openExternal('https://calgo.cf');
                }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);