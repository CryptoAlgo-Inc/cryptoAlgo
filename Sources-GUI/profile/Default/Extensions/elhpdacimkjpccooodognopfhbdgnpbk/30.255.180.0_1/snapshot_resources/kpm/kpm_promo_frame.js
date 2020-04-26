function AddOnClickHandler(className, handler) 
{
    var element = document.querySelector(className);
    if (element)
        AddEventListener(element, "click", handler);
}

AddEventListener(window, "load",
	function () 
	{
        AddOnClickHandler("#kpm_icon", OnNeedShowBalloon);
        AddOnClickHandler("#close_button", OnClickCloseButton);
        AddOnClickHandler("#install_button", OnClickInstallButton);
        AddOnClickHandler("#ignore_button", OnClickSkipNotification);
    });


function OnNeedShowBalloon() 
{
    SendData({ balloonShowed: true });
}

function OnClickCloseButton() 
{
    SendClose(1);
}

function OnClickInstallButton()
{
	SendClose(2);
}

function OnClickSkipNotification()
{
	SendClose(3);
}

function LocalizeElement(id, localeValue)
{
	var element = document.getElementById(id);
	if (element)
		element.appendChild(document.createTextNode(localeValue));
}

window.FrameObject.onLocalize = function (locales)
{
	LocalizeElement("header_text", locales["KpmPromoHeaderTitle"]);
	LocalizeElement("message_title", locales["KpmPromoMessageTitle"]);
	LocalizeElement("message_text", locales["KpmPromoMessageText"]);
	LocalizeElement("install_button", locales["KpmPromoInstallButton"]);
	LocalizeElement("ignore_button", locales["KpmPromoIgnoreButton"]);
}
