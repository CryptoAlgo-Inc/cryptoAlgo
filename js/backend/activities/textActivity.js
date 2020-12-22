function $(i) { return document.getElementById(i); }
function q(u) { return document.querySelector(u);  }

window.prevTimeOut = null;

function hideAfterDelay(elem, delay) {
    if (window.prevTimeOut != null) {
        clearTimeout(prevTimeOut);
        window.prevTimeOut = null;
    }
    window.prevTimeOut = setTimeout(() => {
        elem.classList.add('hidden');
        window.prevTimeOut = null;
    }, delay)
}

async function onStart() {
    console.log('<textCrypto> Started activity text');

    // Handle tab switching
    const tabs = q('.mdc-tab-bar').MDCTabBar;
    tabs.listen('MDCTabBar:activated', function(data) {
        console.debug(`<textCrypto:TabBar> Tab selected: ${data.detail.index}`);

        // Content holders
        const encryptContent = $('encryptContent');
        const decryptContent = $('decryptContent');

        // Select correct content and animate switching
        switch (data.detail.index) {
            case 0:
                console.debug(`<textCrypto:TabBar> Content: Encrypt`);
                encryptContent.classList.remove('hidden');
                encryptContent.classList.remove('contentSwitcher-outLeft');
                decryptContent.classList.add('contentSwitcher-outRight');

                hideAfterDelay(decryptContent, 500); // To prevent resizing issues
                break;
            case 1:
                console.debug(`<textCrypto:TabBar> Content: Decrypt`);
                decryptContent.classList.remove('hidden');
                encryptContent.classList.add('contentSwitcher-outLeft');
                decryptContent.classList.remove('contentSwitcher-outRight');

                hideAfterDelay(encryptContent, 500);
                break;
            default:
                console.error(`<textCrypto:TabBar> Unknown tab selected!`);
        }
    })
}

function onStop() {
    console.debug('<textCrypto> Deleting global vars...');
    delete window.prevTimeOut;
    console.log('<textCrypto> Stopped activity text');
}