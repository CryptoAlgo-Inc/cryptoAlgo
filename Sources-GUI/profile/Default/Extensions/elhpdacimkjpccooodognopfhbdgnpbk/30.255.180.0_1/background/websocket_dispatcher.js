var websocket_proxy;
(function (websocket_proxy) {
    var dispatcher;
    (function (dispatcher) {
        function subscribeToPageEvents(onSocketCall, onPageClosed) {
            chrome.runtime.onMessage.addListener(function (message, sender) {
                if (message.type !== 'websocket_proxy.page.call')
                    return;
                onSocketCall(sender.tab.id, message.call);
            });
            chrome.tabs.onRemoved.addListener(function (pageId, removeInfo) { return onPageClosed(pageId); });
            chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) { return onPageClosed(removedTabId); });
        }
        dispatcher.subscribeToPageEvents = subscribeToPageEvents;
        function sendSocketEventToPage(pageId, event) {
            var message = {
                type: 'websocket_proxy.page.event',
                event: event
            };
            chrome.tabs.sendMessage(pageId, message);
        }
        dispatcher.sendSocketEventToPage = sendSocketEventToPage;
    })(dispatcher = websocket_proxy.dispatcher || (websocket_proxy.dispatcher = {}));
})(websocket_proxy || (websocket_proxy = {}));
