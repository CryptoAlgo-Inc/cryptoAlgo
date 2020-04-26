var xmlhttprequest_proxy;
(function (xmlhttprequest_proxy) {
    var dispatcher;
    (function (dispatcher) {
        function subscribeToRequestEventsFromWorker(listener) {
            chrome.runtime.onMessage.addListener(function (message) {
                if (message.type !== 'request_proxy.page.event')
                    return;
                listener(message.event);
            });
        }
        dispatcher.subscribeToRequestEventsFromWorker = subscribeToRequestEventsFromWorker;
        function sendRequestCallToWorker(call) {
            chrome.runtime.sendMessage({
                type: 'request_proxy.page.call',
                call: call
            });
        }
        dispatcher.sendRequestCallToWorker = sendRequestCallToWorker;
    })(dispatcher = xmlhttprequest_proxy.dispatcher || (xmlhttprequest_proxy.dispatcher = {}));
})(xmlhttprequest_proxy || (xmlhttprequest_proxy = {}));
