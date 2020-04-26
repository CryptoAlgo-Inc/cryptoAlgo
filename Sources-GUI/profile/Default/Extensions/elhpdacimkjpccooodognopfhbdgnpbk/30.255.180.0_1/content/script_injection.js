(function () {
    function getAlreadyInjectedPropertyName(injectionId) {
        return injectionId.substr(0, injectionId.length / 2);
    }
    function evalInPageContext(script) {
        var element = document.createElement("script");
        element.textContent = 'document.currentScript.setAttribute("result", (' + script + '))';
        (document.head || document.documentElement).appendChild(element);
        var result = element.getAttribute("result");
        element.parentNode.removeChild(element);
        return result;
    }
    function isScriptUrlAlreadyInserted(injectionId) {
        var checkScript = "'{}' in window".replace("{}", getAlreadyInjectedPropertyName(injectionId));
        var isInjected = ("true" === evalInPageContext(checkScript));
        return isInjected;
    }
    function isHttps() {
        return "https:" == window.location.protocol;
    }
    function isInjectionRequired(injectionId) {
        var result = isHttps() && !isScriptUrlAlreadyInserted(injectionId);
        trace("injection.isInjectionRequired() = " + result.toString() + ", url = " + document.location.href);
        return result;
    }
    function getStartupParameters(callback) {
        chrome.runtime.sendMessage({
            command: 'getContentStartupParameters' }, function (response) {
            if (response == null) {
                setTimeout(function () {
                    getStartupParameters(callback);
                }, 100);
            }
            else {
                callback(response.injectionId, response.isConnectedToProduct, response.tabId, response.pluginId);
            }
        });
    }
    getStartupParameters(function (injectionId, isConnectedToProduct, currentTabId, pluginId) {
        if (isConnectedToProduct) {
            plugin.callOnDocumentInteractiveOrTimeout(function () {
                initApiInjection(currentTabId, pluginId);
                waitUntilDocumentHeadIsLoaded(function () {
                    if (isInjectionRequired(injectionId)) {
                        if (typeof websocket_proxy !== 'undefined')
                            websocket_proxy.replaceNativeWebSocket();
                        if (typeof xmlhttprequest_proxy !== 'undefined')
                            xmlhttprequest_proxy.replaceNativeXMLHttpRequest();
                        initProductInfo();
                        injectSnapshotScripts(injectionId);
                    }
                });
            });
        }
    });
    function waitUntilDocumentHeadIsLoaded(callback) {
        var observer = null;
        if (documentIsReady())
            callback();
        else
            addEventsListeners();
        function documentIsReady() {
            return !!document.body;
        }
        function addEventsListeners() {
            window.addEventListener('DOMContentLoaded', onEvent, false);
            observer = new MutationObserver(onEvent);
            observer.observe(document.documentElement, { childList: true });
        }
        function removeEventsListeners() {
            window.removeEventListener('DOMContentLoaded', onEvent, false);
            observer.disconnect();
            observer = null;
        }
        function onEvent() {
            if (documentIsReady()) {
                removeEventsListeners();
                callback();
            }
        }
    }
})();
