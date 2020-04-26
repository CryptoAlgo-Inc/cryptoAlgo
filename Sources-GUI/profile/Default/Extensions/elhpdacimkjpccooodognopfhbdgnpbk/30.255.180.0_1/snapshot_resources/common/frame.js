var util;
(function (util) {
    function generateUniqueId() {
        return random4HexChars() + random4HexChars() + random4HexChars() + random4HexChars();
    }
    util.generateUniqueId = generateUniqueId;
    function random4HexChars() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
})(util || (util = {}));
var xmlhttprequest_proxy;
(function (xmlhttprequest_proxy) {
    function replaceNativeXMLHttpRequest() {
        window['XMLHttpRequest'] = XMLHttpRequestProxy;
        xmlhttprequest_proxy.dispatcher.subscribeToRequestEventsFromWorker(XMLHttpRequestProxy.onRequestEventStatic);
    }
    xmlhttprequest_proxy.replaceNativeXMLHttpRequest = replaceNativeXMLHttpRequest;
    var XMLHttpRequestProxy = (function () {
        function XMLHttpRequestProxy() {
            this.onerror = function () { };
            this.onload = function () { };
            this.onprogress = function () { };
            this.onreadystatechange = function () { };
            this.ontimeout = function () { };
            this._id = util.generateUniqueId();
            this.registerThisObject();
            this.forwardRequestCall('__create__', []);
        }
        XMLHttpRequestProxy.onRequestEventStatic = function (event) {
            var request = XMLHttpRequestProxy.xmlHttpRequests[event.requestId];
            if (!request)
                return;
            request.onRequestEvent(event);
        };
        XMLHttpRequestProxy.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args[2] === false)
                throw new Error("Sync XMLHttpRequest deprecated");
            this.forwardRequestCall('open', args);
        };
        XMLHttpRequestProxy.prototype.send = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.forwardRequestCall('send', args);
        };
        XMLHttpRequestProxy.prototype.abort = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            this.forwardRequestCall('abort', args);
            this.unregisterThisObject();
        };
        XMLHttpRequestProxy.prototype.forwardRequestCall = function (name, args) {
            var call = {
                requestId: this._id,
                name: name,
                args: args
            };
            xmlhttprequest_proxy.dispatcher.sendRequestCallToWorker(call);
        };
        XMLHttpRequestProxy.prototype.registerThisObject = function () {
            XMLHttpRequestProxy.xmlHttpRequests[this._id] = this;
        };
        XMLHttpRequestProxy.prototype.unregisterThisObject = function () {
            delete XMLHttpRequestProxy.xmlHttpRequests[this._id];
        };
        XMLHttpRequestProxy.prototype.onRequestEvent = function (event) {
            var handler = XMLHttpRequestProxy.requestEventsWithSpecialHandlers[event.name] || XMLHttpRequestProxy.prototype.onRequestGenericEvent;
            handler.call(this, event);
        };
        XMLHttpRequestProxy.prototype.onRequestFinalEvent = function (event) {
            this.unregisterThisObject();
            this.onRequestGenericEvent(event);
        };
        XMLHttpRequestProxy.prototype.onRequestGenericEvent = function (event) {
            if (event.responseText)
                this.responseText = event.responseText;
            if (event.status)
                this.status = event.status;
            var eventObject = {};
            this[event.name].call(this, eventObject);
        };
        XMLHttpRequestProxy.xmlHttpRequests = {};
        XMLHttpRequestProxy.requestEventsWithSpecialHandlers = {
            'onload': XMLHttpRequestProxy.prototype.onRequestFinalEvent,
            'onerror': XMLHttpRequestProxy.prototype.onRequestFinalEvent
        };
        return XMLHttpRequestProxy;
    }());
})(xmlhttprequest_proxy || (xmlhttprequest_proxy = {}));
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
if (typeof xmlhttprequest_proxy !== "undefined")
	xmlhttprequest_proxy.replaceNativeXMLHttpRequest();

window.FrameObject = {
	// can be replaced by balloon frame script. 

	// Recieve data from main page
	onGetData: function(data, origin){},
	// Recieve locale dictionary
	onLocalize: function(locales){}
}

var m_commandUrl;
var m_pluginName;
var m_cssLoaded = false;
var m_isRtl;
var m_actualStyle;
var m_visible = false;
var m_explicitSize = false;

function AddEventListener(element, name, func)
{
	if ("addEventListener" in element)
		element.addEventListener(name, 
			function(e) 
			{
				try
				{
					func(e || window.event);
				}
				catch (e)
				{
					SendLog(e);
				}
			}, true);
	else
		element.attachEvent("on" + name, 
			function(e)
			{
				try
				{
					func.call(element, e || window.event);
				}
				catch (e)
				{
					SendLog(e);
				}
			});
};


function LocalizeElement(id, localeValue)
{
	var element = document.getElementById(id);
	if (element)
	{
		ClearElement(element);
		element.appendChild(document.createTextNode(localeValue));
	}
}

function ClearElement(element)
{
	while (element && element.firstChild) 
	{
		element.removeChild(element.firstChild);
	}
}

function IsDefined(variable)
{
	return "undefined" !== typeof(variable);
};

function StopProcessingEvent(evt)
{
	if (evt.preventDefault)
		evt.preventDefault();
	else
		evt.returnValue = false;
	if (evt.stopPropagation)
		evt.stopPropagation();
	if (IsDefined(evt.cancelBubble))
		evt.cancelBubble = true;
}

function Init()
{
	AddEventListener(window, "message", OnMessage);
	var cssSrc;
	if (document.location.search)
	{
		cssSrc = ParseQueryString(document.location.search).cssSrc;
	}
	if (cssSrc)
	{
		AddCssLink(cssSrc);
	}
}

function ParseQueryString(queryString)
{
	var queryString = queryString.slice(1);
	var keyValuePairs = queryString.split("&");
	var result = {};
	for (var i = 0; i < keyValuePairs.length; ++i)
	{
		var parsedPair = keyValuePairs[i].split("=");
		result[parsedPair[0]] = decodeURIComponent(parsedPair[1]);
	}
	return result;
}

function AddCssLink(href)
{
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = href;
	AddEventListener(window, "load", OnLoadHandler);
	AddEventListener(link, "error", function(){OnErrorHandler(href);});

	if (document.head)
		document.head.appendChild(link);
	else
		document.getElementsByTagName("head")[0].appendChild(link);
}

function OnLoadHandler()
{
	m_cssLoaded = true;
	if (m_commandUrl)
		ResizeBody(true);
}

function OnErrorHandler(cssHref)
{
	var xhr = window.XDomainRequest ? new window.XDomainRequest : new XMLHttpRequest;
	xhr.open("GET", cssHref);
	xhr.onprogress = function(){};
	xhr.onerror = function(){};
	xhr.onload = function(){InsertCssInline(xhr.responseText);};
	xhr.send();
}

function InsertCssInline(cssData)
{
	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = cssData;
	document.head.appendChild(style);

	setTimeout(OnLoadHandler, 0);
}

function ResizeBody(needSendNewSize)
{
	if (m_explicitSize)
	{
		delete document.body.style.width;
		delete document.body.style.height;
		return;
	}

	document.body.style.width = "1px";
	document.body.style.height = "1px";

	var sizeData = {
		height: document.body.scrollHeight,
		width: document.body.scrollWidth
	};

	if (!sizeData.width || !sizeData.height)
	{
	    setTimeout(function () {
	        sizeData = {
	            height: document.body.scrollHeight,
	            width: document.body.scrollWidth
	        };
	        SendSize(sizeData, needSendNewSize);
	    }, 50);
	}
	else
	{
	    SendSize(sizeData, needSendNewSize);
	}
}

function SendSize(sizeData, needSendNewSize)
{
    document.body.style.width = sizeData.width + "px";
    document.body.style.height = sizeData.height + "px";

    if (needSendNewSize) {
        sizeData.style = m_actualStyle;
        SendCommand("size", sizeData);
    }
}

function SendClose(action)
{
	var closeData = {
		closeAction: action
	};
	SendCommand("close", closeData);
	m_visible = false;
}

function SendData(data)
{
	SendCommand("data", data);
}

function OnInit(message, origin)
{
	m_commandUrl = message.commandUrl;
	m_pluginName = message.pluginName;
	m_isRtl = message.isRtl;
	m_visible = true;

	SetStyle(message.style);
	if (message.locales)
		window.FrameObject.onLocalize(message.locales);
	if (message.data)
		window.FrameObject.onGetData(message.data, origin);
	if (message.explicitSize)
		m_explicitSize = true;

	if (m_cssLoaded)
		ResizeBody(message.needSize);
}

function OnUpdate(message, origin)
{
	m_visible = true;
	SetStyle(message.style);

	if (message.data)
		window.FrameObject.onGetData(message.data, origin);

	if (m_cssLoaded)
		ResizeBody(message.needSize);
}

function SetStyle(style)
{
	m_actualStyle = style ? style.toString() : "";
	document.body.className = m_actualStyle;
	if (m_isRtl)
		document.body.className += " rtl";
}

function OnMessage(evt)
{
	if (!evt || !evt.data || typeof evt.data !== "string") 
		return;
	var message = JSON.parse(evt.data);
	if (message.command === "init")
		OnInit(message, evt.origin);
	else if (message.command === "update")
		OnUpdate(message, evt.origin);
}

function SendCommand(commandType, commandData)
{
	if(!m_visible)
	{
		return;	// do not send commands from invisible balloon, see bug #2437486
	}
	var xhr = window.XDomainRequest ? new window.XDomainRequest : new XMLHttpRequest;
	xhr.open("POST", m_commandUrl + "/to/frameData");
	xhr.onprogress = function(){};
	xhr.onerror = function(){};

	var frameData = {
		pluginName: m_pluginName,
		message: JSON.stringify({type: commandType, data: commandData})
	};
	var command = {
		method: "frameData",
		parameters: JSON.stringify(frameData),
		result: 0
	};
	xhr.send(JSON.stringify(command));
}

function SendLog(error)
{
	if (!m_commandUrl)
		return;
	
	var msg = "" + (error.message || error);
	if (error.stack)
		msg += "\r\n" + error.stack;
	if (msg && msg.length > 2048) 
		msg = msg.substring(0, 2048) + '<...>';
	
	var xhr = window.XDomainRequest ? new window.XDomainRequest : new XMLHttpRequest;
	xhr.open("GET", m_commandUrl + "/log?" + encodeURIComponent(msg));
	xhr.onprogress = function(){};
	xhr.onerror = function(){};
	xhr.send();
}

Init();
