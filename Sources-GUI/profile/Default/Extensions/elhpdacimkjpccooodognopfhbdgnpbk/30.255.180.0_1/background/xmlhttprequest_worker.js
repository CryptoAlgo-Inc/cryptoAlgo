var xmlhttprequest_proxy;
(function (xmlhttprequest_proxy) {
    var worker;
    (function (worker) {
        var requestCallsWithSpecialHandlers = {
            '__create__': onRequestCreateCall,
            'open': onRequestOpenCall,
            'abort': onRequestAbortCall
        };
        var supportedRequestEvents = {
            'onload': onFinalRequestEvent,
            'onreadystatechange': onRequestEvent,
            'ontimeout': onFinalRequestEvent,
            'onerror': onFinalRequestEvent
        };
        var requests = {};
        xmlhttprequest_proxy.dispatcher.subscribeToPageEvents(onRequestCall, onPageClosed);
        function onRequestCall(pageId, call) {
            try {
                var handler = requestCallsWithSpecialHandlers[call.name] || onRequestGenericCall;
                handler.call(this, pageId, call);
            }
            catch (e) {
                onFinalRequestEvent(pageId, call.requestId, 'onerror', { message: "Error calling XMLHttpRequest::" + call.name + call.args + ": " + e });
            }
        }
        function onPageClosed(pageId) {
            for (var requestId in requests)
                if (requests[requestId].pageId === pageId)
                    destroyRequest(pageId, requestId);
        }
        function onRequestCreateCall(pageId, call) {
            createRequest(pageId, call.requestId);
        }
        function onRequestOpenCall(pageId, call) {
            call.args[1] = call.args[1].replace("https://", "http://");
            onRequestGenericCall(pageId, call);
        }
        function onRequestAbortCall(pageId, call) {
            onRequestGenericCall(pageId, call);
            destroyRequest(pageId, call.requestId);
        }
        function onRequestGenericCall(pageId, call) {
            var request = findRequest(call.requestId);
            if (!request)
                throw new Error("Request " + call.requestId + " not found");
            request[call.name].apply(request, call.args);
        }
        function onRequestEvent(pageId, requestId, eventName, eventObject) {
            var request = findRequest(requestId);
            var event = {
                requestId: requestId,
                name: eventName,
                responseText: request && request.responseText,
                status: request && request.status
            };
            xmlhttprequest_proxy.dispatcher.sendRequestEventToPage(pageId, event);
        }
        function onFinalRequestEvent(pageId, requestId, eventName, eventArgs) {
            onRequestEvent(pageId, requestId, eventName, eventArgs);
            destroyRequest(pageId, requestId);
        }
        function createRequest(pageId, requestId) {
            var request = new XMLHttpRequest();
            var _loop_1 = function() {
                var handler = supportedRequestEvents[eventName];
                var thisEventName = eventName;
                request[eventName] = function (eventObject) { return handler(pageId, requestId, thisEventName, eventObject); };
            };
            for (var eventName in supportedRequestEvents) {
                _loop_1();
            }
            registerRequest(requestId, {
                pageId: pageId,
                request: request
            });
        }
        function destroyRequest(pageId, requestId) {
            var request = findRequest(requestId);
            if (!request)
                return;
            unregisterRequest(requestId);
            var doNothing = function () { };
            for (var eventName in supportedRequestEvents)
                request[eventName] = doNothing;
        }
        function registerRequest(requestId, request) {
            if (requests[requestId])
                throw new Error("Attempt to register already registered request " + requestId);
            requests[requestId] = request;
        }
        function unregisterRequest(requestId) {
            delete requests[requestId];
        }
        function findRequest(requestId) {
            var request = requests[requestId];
            return request && request.request;
        }
    })(worker = xmlhttprequest_proxy.worker || (xmlhttprequest_proxy.worker = {}));
})(xmlhttprequest_proxy || (xmlhttprequest_proxy = {}));
