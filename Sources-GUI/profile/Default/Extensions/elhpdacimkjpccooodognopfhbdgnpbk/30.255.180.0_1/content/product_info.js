var GetInstalledProducts2_RequestEventName = "getInstalledProducts2.request" + new Date().getTime() + ProductType;
var GetInstalledProducts2_ResponseEventName = "getInstalledProducts2.response" + new Date().getTime() + ProductType;
function injectScript(script) {
    var element = document.createElement('script');
    element.textContent = script;
    element.type = "text/javascript";
    (document.head || document.documentElement).appendChild(element);
    element.parentNode.removeChild(element);
}
function SnapshotScriptProxy() {
    function prepareNamespaceFunc() {
        window.KasperskyLab = window.KasperskyLab || {};
        window.KasperskyLab._products = window.KasperskyLab._products || {};
        window.KasperskyLab._products2 = window.KasperskyLab._products2 || {};
    }
    function getInstalledProductsFunc() {
        window.KasperskyLab._products['%ID%'] = JSON.parse('%PRODUCTS%');
        window.KasperskyLab.getInstalledProducts = function () {
            var products = [];
            for (var productId in window.KasperskyLab._products) {
                products = products.concat(window.KasperskyLab._products[productId]);
            }
            return products;
        };
    }
    function getInstalledProducts2Func() {
        function impl(challenge, timeout, callback) {
            var responseEventName = '%RESPONSE_EVENT_NAME%';
            var onGetInstalledProductsResponse = function (event) {
                window.removeEventListener(responseEventName, onGetInstalledProductsResponse);
                callback(event.detail.signedInfo);
            };
            window.addEventListener(responseEventName, onGetInstalledProductsResponse);
            var requestEvent = new CustomEvent('%REQUEST_EVENT_NAME%', { detail: [challenge, timeout] });
            window.dispatchEvent(requestEvent);
        }
        window.KasperskyLab._products2['%ID%'] = impl;
        window.KasperskyLab.getInstalledProducts2 = function (challenge, timeout, callback) {
            for (var productId in window.KasperskyLab._products2) {
                try {
                    window.KasperskyLab._products2[productId](challenge, timeout, callback);
                }
                catch (e) {
                    console.error("getInstalledProducts2() failed for " + productId, ": ", e);
                }
            }
        };
    }
    function injectAndExecuteFunction(code) {
        injectScript("(" + code + ")()");
    }
    function injectGetInstalledProductsFunction() {
        var installedProducts = JSON.stringify(window.KasperskyLab.getInstalledProducts());
        var getInstalledProductsFunctionBody = getInstalledProductsFunc.toString()
            .replace("%PRODUCTS%", installedProducts);
        injectAndExecuteFunction(getInstalledProductsFunctionBody);
    }
    function injectGetInstalledProducts2Function() {
        var getInstalledProducts2FunctionBody = getInstalledProducts2Func.toString()
            .replace("%ID%", ProductType)
            .replace("%REQUEST_EVENT_NAME%", GetInstalledProducts2_RequestEventName)
            .replace("%RESPONSE_EVENT_NAME%", GetInstalledProducts2_ResponseEventName);
        injectAndExecuteFunction(getInstalledProducts2FunctionBody);
    }
    function init() {
        injectAndExecuteFunction(prepareNamespaceFunc.toString());
        injectGetInstalledProductsFunction();
        injectGetInstalledProducts2Function();
    }
    init();
}
var proxyInstance = null;
function initProductInfo() {
    window.addEventListener("cb.ready", function (event) {
        if (!proxyInstance && window.KasperskyLab) {
            proxyInstance = new SnapshotScriptProxy();
        }
    });
    window.addEventListener(GetInstalledProducts2_RequestEventName, function (event) {
        var challenge = event.detail[0];
        var timeout = event.detail[1];
        window.KasperskyLab.getInstalledProducts2(challenge, timeout, function (signedProductInfo) {
            var event = new CustomEvent(GetInstalledProducts2_ResponseEventName, { detail: { signedInfo: signedProductInfo } });
            window.dispatchEvent(event);
        });
    });
}
