var m_needShowAdditionalMenu = false;

window.FrameObject.onGetData = OnGetData;

function AddOnClickHandler(className, handler)
{
	var element = document.getElementsByClassName(className)[0];
	if (element)
		AddEventListener(element, "click", handler);
}

AddEventListener(window, "load",
	function()
	{
		AddOnClickHandler("popup-header__close-button", OnClickCloseButton);
		AddOnClickHandler("popup-header__hide-button", OnShowSubmenu);
		AddOnClickHandler("popup-header__hide-menu", OnClickSkipNotification);
		AddOnClickHandler("button", OnClickInstallButton);
		var mainDiv = document.getElementById("mainDiv");
		AddOnClickHandler("main-div", OnBalloonClick);
	});

function AdditionalMenuUpdate()
{
	mainDiv.className = m_needShowAdditionalMenu ? "show_hide_menu" : ""
}

function OnClickCloseButton()
{
	SendClose(1);
}

function OnShowSubmenu()
{
	var mainDiv = document.getElementById("mainDiv");
	m_needShowAdditionalMenu = !m_needShowAdditionalMenu;
	AdditionalMenuUpdate();
}

function OnBalloonClick()
{
	m_needShowAdditionalMenu = false;
	SendData({isNeedRestoreFocus: true});
	AdditionalMenuUpdate();
}

function OnClickSkipNotification()
{
	SendClose(2);
}

function OnClickInstallButton()
{
	SendClose(3);
}

function OnGetData(data)
{
	var className = "";

	var passwordStrength = data.strength;
	if (passwordStrength)
	{
		var strengthName;
		switch (passwordStrength.quality)
		{
			case 0:
			case 1:  strengthName = "strong"; break;
			case 2:  strengthName = "average"; break;
			default: strengthName = "weak"; break;
		}
		className = "popup_" + strengthName;
		if (passwordStrength.quality > 1)
		{
			className += " " + strengthName + "-reason-";
			switch (passwordStrength.reasons[0])
			{
				case 0:
				case 4: className += "keyboard"; break;
				case 1: className += "frequent-words"; break;
				case 2: className += "length"; break;
				case 3: className += "alternation"; break;
			}
		}
	}

	var arrowClassName = "arrow-show-" + data.arrow;

	document.body.className += " " + className + " " + arrowClassName;
}

function LocalizeElement(id, localeValue)
{
	var element = document.getElementById(id);
	if (element)
		element.appendChild(document.createTextNode(localeValue));
}

window.FrameObject.onLocalize = function(locales)
{
	LocalizeElement("verdictTitle", locales["PasswordControlVerdictTitle"]);
	LocalizeElement("verdictStrong", locales["PasswordControlVerdictStrong"]);
	LocalizeElement("verdictAverage", locales["PasswordControlVerdictAverage"]);
	LocalizeElement("verdictWeak", locales["PasswordControlVerdictWeak"]);
	LocalizeElement("verdictTitleEmpty", locales["PasswordControlEmptyHeader"]);
	LocalizeElement("skipNotification", locales["PasswordControlSkipNotification"]);
	LocalizeElement("recomendations", locales["PasswordControlRecommendations"]);
	LocalizeElement("recomendationLength", locales["PasswordControlRecommendationLength"]);
	LocalizeElement("recomendationKeyboard", locales["PasswordControlRecommendationKeyboard"]);
	LocalizeElement("recomendationFrequentWords", locales["PasswordControlRecommendationFrequentWords"]);
	LocalizeElement("recomendationAlternation", locales["PasswordControlRecommendationAlternation"]);
	LocalizeElement("recomendation", locales["PasswordControlRecomendation"]);
}
