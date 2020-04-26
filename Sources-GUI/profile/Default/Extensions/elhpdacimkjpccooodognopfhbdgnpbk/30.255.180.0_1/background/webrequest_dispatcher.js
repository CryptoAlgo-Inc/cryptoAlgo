var webrequest;
(function (webrequest) {
    var dispatcher;
    (function (dispatcher) {
        function subscribeToRequestEvents(onBeforeRequestHandler, onBeforeSendHeaders, onHeadersReceived, onAuthRequired, onCompleted, onError) {
            var filter = { urls: ["https://*/*"] };
            var blockingOption = ["blocking"];
            chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestHandler, filter, blockingOption);
            chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, filter, blockingOption);
            chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, blockingOption);
            chrome.webRequest.onAuthRequired.addListener(onAuthRequired, filter, blockingOption);
            chrome.webRequest.onCompleted.addListener(onCompleted, filter, []);
            chrome.webRequest.onErrorOccurred.addListener(onError, filter);
        }
        dispatcher.subscribeToRequestEvents = subscribeToRequestEvents;
    })(dispatcher = webrequest.dispatcher || (webrequest.dispatcher = {}));
})(webrequest || (webrequest = {}));
