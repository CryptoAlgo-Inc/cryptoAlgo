var websocket_proxy;
(function (websocket_proxy) {
    function replaceNativeWebSocket() {
        window['WebSocket'] = WebSocketProxy;
        websocket_proxy.dispatcher.subscribeToSocketEventsFromWorker(WebSocketProxy.onSocketEventStatic);
    }
    websocket_proxy.replaceNativeWebSocket = replaceNativeWebSocket;
    var WebSocketProxy = (function () {
        function WebSocketProxy(url) {
            this.onerror = function () { };
            this.onclose = function () { };
            this.onopen = function () { };
            this.onmessage = function () { };
            this._id = util.generateUniqueId();
            this.registerThisObject();
            this.forwardSocketCall('__create__', [url]);
        }
        WebSocketProxy.onSocketEventStatic = function (event) {
            var socket = WebSocketProxy.sockets[event.socketId];
            if (!socket)
                return;
            socket.onSocketEvent(event);
        };
        WebSocketProxy.prototype.send = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.forwardSocketCall('send', args);
        };
        WebSocketProxy.prototype.close = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.unregisterThisObject();
            this.forwardSocketCall('close', args);
        };
        WebSocketProxy.prototype.forwardSocketCall = function (name, args) {
            var call = {
                socketId: this._id,
                name: name,
                args: args
            };
            websocket_proxy.dispatcher.sendSocketCallToWorker(call);
        };
        WebSocketProxy.prototype.registerThisObject = function () {
            WebSocketProxy.sockets[this._id] = this;
        };
        WebSocketProxy.prototype.unregisterThisObject = function () {
            delete WebSocketProxy.sockets[this._id];
        };
        WebSocketProxy.prototype.onSocketEvent = function (event) {
            var handler = WebSocketProxy.socketEventsWithSpecialHandlers[event.name] || WebSocketProxy.prototype.onSocketGenericEvent;
            handler.call(this, event);
        };
        WebSocketProxy.prototype.onSocketFinalEvent = function (event) {
            this.unregisterThisObject();
            this.onSocketGenericEvent(event);
        };
        WebSocketProxy.prototype.onSocketGenericEvent = function (event) {
            this.readyState = event.readyState;
            var eventObject = {
                data: event.messageData,
                code: event.closeCode
            };
            this[event.name].call(this, eventObject);
        };
        WebSocketProxy.sockets = {};
        WebSocketProxy.socketEventsWithSpecialHandlers = {
            'onclose': WebSocketProxy.prototype.onSocketFinalEvent,
            'onerror': WebSocketProxy.prototype.onSocketFinalEvent
        };
        return WebSocketProxy;
    }());
})(websocket_proxy || (websocket_proxy = {}));
