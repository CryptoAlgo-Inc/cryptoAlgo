var xmlhttprequest_proxy;
(function (xmlhttprequest_proxy) {
    function replaceNativeXMLHttpRequest() {
        window['XMLHttpRequest'] = XMLHttpRequestProxy;
        xmlhttprequest_proxy.dispatcher.subscribeToRequestEventsFromWorker(XMLHttpRequestProxy.onRequestEventStatic);
    }
    xmlhttprequest_proxy.replaceNativeXMLHttpRequest = replaceNativeXMLHttpRequest;
    var XMLHttpRequestProxy = (function () {
        function XMLHttpRequestProxy() {
            this.onerror = function () { };
            this.onload = function () { };
            this.onprogress = function () { };
            this.onreadystatechange = function () { };
            this.ontimeout = function () { };
            this._id = util.generateUniqueId();
            this.registerThisObject();
            this.forwardRequestCall('__create__', []);
        }
        XMLHttpRequestProxy.onRequestEventStatic = function (event) {
            var request = XMLHttpRequestProxy.xmlHttpRequests[event.requestId];
            if (!request)
                return;
            request.onRequestEvent(event);
        };
        XMLHttpRequestProxy.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args[2] === false)
                throw new Error("Sync XMLHttpRequest deprecated");
            this.forwardRequestCall('open', args);
        };
        XMLHttpRequestProxy.prototype.send = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.forwardRequestCall('send', args);
        };
        XMLHttpRequestProxy.prototype.abort = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.forwardRequestCall('abort', args);
            this.unregisterThisObject();
        };
        XMLHttpRequestProxy.prototype.forwardRequestCall = function (name, args) {
            var call = {
                requestId: this._id,
                name: name,
                args: args
            };
            xmlhttprequest_proxy.dispatcher.sendRequestCallToWorker(call);
        };
        XMLHttpRequestProxy.prototype.registerThisObject = function () {
            XMLHttpRequestProxy.xmlHttpRequests[this._id] = this;
        };
        XMLHttpRequestProxy.prototype.unregisterThisObject = function () {
            delete XMLHttpRequestProxy.xmlHttpRequests[this._id];
        };
        XMLHttpRequestProxy.prototype.onRequestEvent = function (event) {
            var handler = XMLHttpRequestProxy.requestEventsWithSpecialHandlers[event.name] || XMLHttpRequestProxy.prototype.onRequestGenericEvent;
            handler.call(this, event);
        };
        XMLHttpRequestProxy.prototype.onRequestFinalEvent = function (event) {
            this.unregisterThisObject();
            this.onRequestGenericEvent(event);
        };
        XMLHttpRequestProxy.prototype.onRequestGenericEvent = function (event) {
            if (event.responseText)
                this.responseText = event.responseText;
            if (event.status)
                this.status = event.status;
            var eventObject = {};
            this[event.name].call(this, eventObject);
        };
        XMLHttpRequestProxy.xmlHttpRequests = {};
        XMLHttpRequestProxy.requestEventsWithSpecialHandlers = {
            'onload': XMLHttpRequestProxy.prototype.onRequestFinalEvent,
            'onerror': XMLHttpRequestProxy.prototype.onRequestFinalEvent
        };
        return XMLHttpRequestProxy;
    }());
})(xmlhttprequest_proxy || (xmlhttprequest_proxy = {}));
