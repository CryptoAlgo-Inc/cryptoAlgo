var plugin = {
    callOnDocumentInteractiveOrTimeout: function (callback) {
        if ("loading" == document.readyState) {
            var callbackCalled = false;
            function tryRunCallback() {
                if (!callbackCalled) {
                    callbackCalled = true;
                    callback();
                }
            }
            setTimeout(function () {
                if ("loading" != document.readyState) {
                    tryRunCallback();
                }
                else {
                    document.addEventListener("DOMContentLoaded", tryRunCallback);
                    setTimeout(function () {
                        tryRunCallback();
                    }, 10000);
                }
            }, 100);
        }
        else {
            setTimeout(callback, 0);
        }
    }
};
