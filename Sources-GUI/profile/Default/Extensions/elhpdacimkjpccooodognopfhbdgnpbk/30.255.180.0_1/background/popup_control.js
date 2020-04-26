function PopupControl(factorySettings) {
    this.resetToFactory = function () {
        setUrl(factorySettings.url);
    };
    this.enableOnlineMode = function () {
        setUrl("/popup/popup.html");
    };
    function setUrl(popupUrl) {
        chrome.browserAction.setPopup({
            popup: popupUrl
        });
    }
}
