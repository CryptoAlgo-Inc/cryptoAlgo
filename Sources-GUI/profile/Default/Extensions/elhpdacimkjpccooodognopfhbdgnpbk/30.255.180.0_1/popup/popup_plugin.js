(function Popup() {
    var m_tabId = null;
    function buildApi() {
        var api = {
            setPopupSize: function () { },
            closePopup: function () {
                close();
            },
            openWebPage: function (webPage) {
                chrome.runtime.sendMessage({ command: 'openWebPage', message: webPage });
            },
            reloadActiveTab: function () {
                chrome.runtime.sendMessage({ command: 'reloadActiveTab' });
            },
            getTabId: function () {
                return m_tabId;
            }
        };
        return api;
    }
    function publishApi() {
        console.debug("Publish Popup API.");
        window.plugin = buildApi();
    }
    function getStartupParameters(callback) {
        chrome.runtime.sendMessage({
            command: 'getPopupStartupParameters' }, function (response) {
            m_tabId = response.tabId;
            callback(response.injectionId);
        });
    }
    function onDomContentLoaded() {
        getStartupParameters(function (injectionId) {
            publishApi();
            injectSnapshotScripts(injectionId);
        });
    }
    document.addEventListener("DOMContentLoaded", onDomContentLoaded);
})();
