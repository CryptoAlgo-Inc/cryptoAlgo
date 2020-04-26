var websocket_proxy;
(function (websocket_proxy) {
    var dispatcher;
    (function (dispatcher) {
        function subscribeToSocketEventsFromWorker(listener) {
            chrome.runtime.onMessage.addListener(function (message) {
                if (message.type !== 'websocket_proxy.page.event')
                    return;
                listener(message.event);
            });
        }
        dispatcher.subscribeToSocketEventsFromWorker = subscribeToSocketEventsFromWorker;
        function sendSocketCallToWorker(call) {
            chrome.runtime.sendMessage({
                type: 'websocket_proxy.page.call',
                call: call
            });
        }
        dispatcher.sendSocketCallToWorker = sendSocketCallToWorker;
    })(dispatcher = websocket_proxy.dispatcher || (websocket_proxy.dispatcher = {}));
})(websocket_proxy || (websocket_proxy = {}));
