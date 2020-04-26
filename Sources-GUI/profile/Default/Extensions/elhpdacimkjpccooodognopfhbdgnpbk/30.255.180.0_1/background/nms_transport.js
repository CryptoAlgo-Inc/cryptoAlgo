function NMServer(caller)
{
	var hostName = "com.kaspersky." + chrome.runtime.id.replace("@", ".") + ".nms";
	var m_port = chrome.runtime.connectNative(hostName);
	var m_caller = caller;

	this.onReceived = function(msg)
	{
		m_caller.onReceived(msg);
	}

	this.onServerDisconnected = function()
	{
		m_caller.onServerDisconnected();
		m_port = null;		
	}

	this.Send = function(msg)
	{
	     m_port.postMessage(msg);
	}
	m_port.onMessage.addListener(this.onReceived);
	m_port.onDisconnect.addListener(this.onServerDisconnected);
}

function NativeMessagingTransport()
{
	var m_clientId = 1;
	var m_clients = [];
	var _this = this;
	var nmServer = null;
	var m_wasConnected = false;
	
	function CheckPort(port)
	{
		if (typeof port == "undefined" || typeof port.id == "undefined")
			return false;
		return true;
	}

	function NewConnection(port)
	{
		if (!nmServer)
			nmServer = new NMServer(_this);
			
		port.id = m_clientId++;
		m_clients[port.id] = port;
		port.onDisconnect.addListener(function()
			{
				delete m_clients[this.id];				
			});
		port.onMessage.addListener(ProcessMessage);
		if (m_wasConnected)
			port.postMessage("connect");
	}
	
	function ProcessMessage(msg, port)
	{
		if (!CheckPort(port) || !nmServer)
		{
			port.disconnect();
			delete m_clients[port.id];
			return;
		}
		nmServer.Send({clientId: port.id, message: msg});
	}
	this.onReceived = function(obj)
	{
		if (!m_wasConnected)
		{
			m_wasConnected = true;
			m_clients.forEach(function(port){
					if (port)
						port.postMessage("connect");
				});
			return;
		}

		if (typeof obj.clientId == "undefined")
		{
			console.debug("Invalid message");
			return;
		}

		var port = m_clients[obj.clientId];
		if (!port)
		{
			console.debug("Port didn't find");
			return;
		}
		port.postMessage(obj.message);
	}
	
	
	this.onServerDisconnected = function()	
	{
		m_wasConnected = false;
		nmServer = null;
		m_clients.forEach(function(port){
			if (port)
				port.disconnect();
		});
		m_clients = [];
	}
	
	this.connect = function(port)
	{
		NewConnection(port);
	}
	
	function init()
	{
		chrome.runtime.onConnect.addListener(NewConnection);
	}
	init();

	
}

var nativeMessagingTransport = new NativeMessagingTransport();
