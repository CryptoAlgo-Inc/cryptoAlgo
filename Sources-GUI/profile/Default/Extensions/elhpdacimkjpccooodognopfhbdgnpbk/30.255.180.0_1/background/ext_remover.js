
var FrameObject = {
	onGetData: function(args, origin)
	{
		if (origin !== "https://gc.kis.v2.scr.kaspersky-labs.com")
			return;

		var data = JSON.parse(args);

		var dbutton = document.getElementById('dbutton');
		var cbutton = document.getElementById('cbutton');

		AddEventListener(dbutton, "click", 
			function(evt){
					chrome.extension.sendMessage({command: "deletePlugin", id: data.id}, 
						function(result)
						{
							SendClose({result: result.result, errorText: result.errorText});
						});
					evt.stopPropagation && evt.stopPropagation();
					evt.preventDefault && evt.preventDefault();
			});
		AddEventListener(cbutton, "click", 
			function(evt){
				SendClose({result: 0});
				evt.stopPropagation && evt.stopPropagation();
				evt.preventDefault && evt.preventDefault();
			});

		document.getElementById('ExtRemoverSuccessWindowLinkAboutText').href = data.urlAbout;
		var liElem = document.getElementById("delete-reason-element");
		data.verdicts.forEach(function(d)
			{
				var newElem = liElem.cloneNode(true);
				newElem.getElementsByClassName('delete-reason-element-verdict')[0].childNodes[0].appendChild(document.createTextNode(d.verdict));
				// TODO add description
				liElem.parentNode.insertBefore(newElem, liElem);
			});
		liElem.parentNode.removeChild(liElem);

		for (var name in data.locales)
		{
			var elem = document.getElementById(name);
			if (elem)
				elem.appendChild(document.createTextNode(data.locales[name]));
		}


		chrome.extension.sendMessage({command: "getPluginInfo", id: data.id}, function(info){
				window.top.window.postMessage(JSON.stringify({action: "connect"}), "*");
				if (info.errorText)
				{
					SendClose({result: -1, errorText: info.errorText, code: 1});
				}				
				else if (info.name)
				{
					if (info.icons && info.icons[0] && info.icons[0].base64)
					    document.getElementById('extension-ico').src = info.icons[0].base64;
					document.getElementById('extension-name').appendChild(document.createTextNode(info.name));
				}
			});
	}
}





