function isBackgroundPage() {
    var protocol = location.protocol.toString();
    return ('chrome-extension:' === protocol
        || 'ms-browser-extension:' === protocol
        || 'moz-extension:' === protocol);
}
function Tracer(browserName, prefix) {
    var m_prefix = browserName + ':' + prefix;
    var m_queuedMessages = [];
    var m_isBackroundPage = isBackgroundPage();
    function prepareMsg(msg) {
        return "{0} ({1}): {2}"
            .replace("{0}", m_prefix)
            .replace("{1}", new Date().getTime())
            .replace("{2}", msg);
    }
    function flushQueuedMessages() {
        if (!m_queuedMessages.length) {
            return;
        }
        m_queuedMessages.forEach(function (msg) {
            send(msg);
        });
        m_queuedMessages = [];
    }
    function send(msg) {
        if (m_isBackroundPage) {
            var hasProductTracer = window.product && window.product.tracer;
            if (hasProductTracer) {
                window.product.tracer.log(msg);
            }
        }
        else {
            chrome.runtime.sendMessage({
                command: 'trace',
                message: msg
            });
        }
    }
    this.log = function (msg, withoutPrefix) {
        try {
            var message = withoutPrefix ? msg : prepareMsg(msg);
            m_queuedMessages.push(message);
            flushQueuedMessages();
        }
        catch (e) {
            console.error("Failed to trace a message:", e);
        }
    };
}
g_tracer = null;
function initializeTracer() {
    var tracePrefix = isBackgroundPage() ? "main" : "content";
    g_tracer = new Tracer(BrowserName, tracePrefix);
}
function trace(msg, duplicateToConsole) {
    g_tracer.log(msg);
    if (duplicateToConsole) {
        console.debug(msg);
    }
}
function traceAsIs(msg) {
    var withoutPrefix = true;
    g_tracer.log(msg, withoutPrefix);
}
initializeTracer();
