function initApiInjection(currentTabId, pluginId) {
    publishApi(currentTabId, pluginId);
    function executeScriptInDocument(contents) {
        var headNode = document.querySelector("head") || document.querySelector("body");
        var scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.text = contents;
        headNode.appendChild(scriptNode);
        headNode.removeChild(scriptNode);
    }
    function publishApi(currentTabId, pluginId) {
        trace("api.publishApi(), url = " + document.location.href);
        window[TabIdPropertyName] = currentTabId;
        var script = "window.{0} = '{1}';".
            replace("{0}", TabIdPropertyName).
            replace("{1}", currentTabId);
        if (document.location.href.toLowerCase().search("https://gc.kis.v2.scr.kaspersky-labs.com/") != -1) {
            script += "window.{0} = '{1}';".
                replace("{0}", TabIdPropertyName + "_plugin").
                replace("{1}", pluginId);
        }
        executeScriptInDocument(script);
        fireReadyEvent();
    }
    function fireReadyEvent() {
        trace("api.fireReadyEvent(), url = " + document.location.href);
        window.dispatchEvent(new CustomEvent(ApiReadyEventName));
    }
}
