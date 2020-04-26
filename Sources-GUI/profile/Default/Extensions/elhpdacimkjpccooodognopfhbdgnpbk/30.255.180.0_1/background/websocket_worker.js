var websocket_proxy;
(function (websocket_proxy) {
    var worker;
    (function (worker) {
        var socketCallsWithSpecialHandlers = {
            '__create__': onSocketCreateCall,
            'close': onSocketCloseCall
        };
        var supportedSocketEvents = {
            'onopen': onSocketEvent,
            'onmessage': onSocketEvent,
            'onclose': onFinalSocketEvent,
            'onerror': onFinalSocketEvent
        };
        var sockets = {};
        websocket_proxy.dispatcher.subscribeToPageEvents(onSocketCall, onPageClosed);
        function onSocketCall(pageId, call) {
            try {
                var handler = socketCallsWithSpecialHandlers[call.name] || onSocketGenericCall;
                handler.call(this, pageId, call);
            }
            catch (e) {
                onFinalSocketEvent(pageId, call.socketId, 'onerror', { message: "Error calling WebSocket::" + call.name + call.args + ": " + e });
            }
        }
        function onPageClosed(pageId) {
            for (var socketId in sockets)
                if (sockets[socketId].pageId === pageId)
                    destroySocket(pageId, socketId);
        }
        function onSocketCreateCall(pageId, call) {
            var url = call.args[0];
            createSocket(pageId, call.socketId, url);
        }
        function onSocketCloseCall(pageId, call) {
            destroySocket(pageId, call.socketId);
        }
        function onSocketGenericCall(pageId, call) {
            var socket = findSocket(call.socketId);
            if (!socket)
                throw new Error("Socket " + call.socketId + " not found");
            socket[call.name].apply(socket, call.args);
        }
        function onSocketEvent(pageId, socketId, eventName, eventObject) {
            var socket = findSocket(socketId);
            var event = {
                socketId: socketId,
                name: eventName,
                messageData: eventObject && eventObject.data && String(eventObject.data),
                closeCode: eventObject && eventObject.code,
                readyState: socket && socket.readyState
            };
            websocket_proxy.dispatcher.sendSocketEventToPage(pageId, event);
        }
        function onFinalSocketEvent(pageId, socketId, eventName, eventArgs) {
            onSocketEvent(pageId, socketId, eventName, eventArgs);
            destroySocket(pageId, socketId);
        }
        function createSocket(pageId, socketId, url) {
            var socket = new WebSocket(url);
            var _loop_1 = function() {
                var handler = supportedSocketEvents[eventName];
                var thisEventName = eventName;
                socket[eventName] = function (eventObject) { return handler(pageId, socketId, thisEventName, eventObject); };
            };
            for (var eventName in supportedSocketEvents) {
                _loop_1();
            }
            registerSocket(socketId, {
                pageId: pageId,
                socket: socket
            });
        }
        function destroySocket(pageId, socketId) {
            var socket = findSocket(socketId);
            if (!socket)
                return;
            unregisterSocket(socketId);
            var doNothing = function () { };
            for (var eventName in supportedSocketEvents)
                socket[eventName] = doNothing;
            socket.close();
        }
        function registerSocket(socketId, socket) {
            if (sockets[socketId])
                throw new Error("Attempt to register already registered socket " + socketId);
            sockets[socketId] = socket;
        }
        function unregisterSocket(socketId) {
            delete sockets[socketId];
        }
        function findSocket(socketId) {
            var socket = sockets[socketId];
            return socket && socket.socket;
        }
    })(worker = websocket_proxy.worker || (websocket_proxy.worker = {}));
})(websocket_proxy || (websocket_proxy = {}));
