var xmlhttprequest_proxy;
(function (xmlhttprequest_proxy) {
    var dispatcher;
    (function (dispatcher) {
        function subscribeToPageEvents(onRequestCall, onPageClosed) {
            chrome.runtime.onMessage.addListener(function (message, sender) {
                if (message.type !== 'request_proxy.page.call')
                    return;
                onRequestCall(sender.tab.id, message.call);
            });
            chrome.tabs.onRemoved.addListener(function (pageId, removeInfo) { return onPageClosed(pageId); });
            chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) { return onPageClosed(removedTabId); });
        }
        dispatcher.subscribeToPageEvents = subscribeToPageEvents;
        function sendRequestEventToPage(pageId, event) {
            var message = {
                type: 'request_proxy.page.event',
                event: event
            };
            chrome.tabs.sendMessage(pageId, message);
        }
        dispatcher.sendRequestEventToPage = sendRequestEventToPage;
    })(dispatcher = xmlhttprequest_proxy.dispatcher || (xmlhttprequest_proxy.dispatcher = {}));
})(xmlhttprequest_proxy || (xmlhttprequest_proxy = {}));
