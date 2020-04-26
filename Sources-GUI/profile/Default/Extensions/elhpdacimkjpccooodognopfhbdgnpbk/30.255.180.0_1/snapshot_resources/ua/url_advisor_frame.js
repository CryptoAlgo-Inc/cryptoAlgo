/**
	 *  @private
	 *  @param {number} category
	 *  @return {string}
	 */
function ConvertCategory(category, locales) 
{
	return locales["CAT_" + category];
}

/** @type {array}*/var m_verdictTagElements = [];

function ConvertThreat(threat, locales)
{
	var threatTypes = [
		{name:'Unknown', bit:-1},
		{name:locales["PhishingName"], bit:62},
		{name:locales["MalwareName"], bit:63}
	];
	
	return threatTypes[threat].name;
}

function AppendChildElementWithText(document, nodeType, parent, text, className) 
{
	var span = document.createElement(nodeType);
	span.className = className;
	span.appendChild(document.createTextNode(text));
	parent.appendChild(span);
	m_verdictTagElements.push(span);
}

function AddPoliceDecisionTag(document, parent, text, className, locales) 
{
	var div = document.createElement("div");
	div.className = "kl_police_decision";
	var policeLink = document.createElement("a");
	policeLink.href = IsDefined(UrlAdvisorLinkPoliceDecision) ? UrlAdvisorLinkPoliceDecision : locales["UrlAdvisorLinkPoliceDecision"];
	policeLink.target = "_blank";
	div.appendChild(policeLink);
	var span = document.createElement("span");
	span.className = className;
	span.appendChild(document.createTextNode(text));
	policeLink.appendChild(span);
	parent.appendChild(div);
	m_verdictTagElements.push(div);
}

function AddTagsFromList(parentElement, list, converter, document, locales) 
{
	if (!list)
		return;
	for (var i = 0, count = list.length; i < count; ++i) 
	{
		if (list[i] != 21)
		{
			AppendChildElementWithText(document, "span", parentElement, converter(list[i], locales), "kl_tag");
		}
		else
		{
			AddPoliceDecisionTag(document, parentElement, converter(list[i], locales), "kl_tag", locales);
		}
	}
}

function AddVerdictTags(document, verdict, locales) 
{
	var mainDiv = document.getElementById("TagBlockAdditionalStyle");
	if ((!verdict.categories || verdict.categories.length == 0) && (!verdict.threats || verdict.threats.length == 0)) 
	{
		mainDiv.className = "empty_tags";
		return;
	}

	mainDiv.className = "";

	var m_tagDiv = document.getElementById("tagsList");

	AddTagsFromList(m_tagDiv, verdict.categories, ConvertCategory, document, locales);
	AddTagsFromList(m_tagDiv, verdict.threats, ConvertThreat, document, locales);
}

function RemoveVerdictTags(document)
{
    for (var i = 0; i < m_verdictTagElements.length; i++)
    {
        m_verdictTagElements[i].parentElement.removeChild(m_verdictTagElements[i]);
    }
    m_verdictTagElements = [];
}

window.FrameObject.onGetData = function (data) 
{
    LocalizeElement("url", data.verdict.urlUserFriendly || data.verdict.url);
    RemoveVerdictTags(document);
	AddVerdictTags(document, data.verdict, data.locales);
}

function SetLinkUrl(id, url) 
{
	var element = document.getElementById(id);
	if (element)
		element.href = url;
}

window.FrameObject.onLocalize = function (locales) 
{
	LocalizeElement("greenHead", locales["UrlAdvisorBalloonHeaderGood"])
	LocalizeElement("greyHead", locales["UrlAdvisorBalloonHeaderSuspicious"])
	LocalizeElement("redHead", locales["UrlAdvisorBalloonHeaderDanger"])
	LocalizeElement("yellowHead", locales["UrlAdvisorBalloonHeaderWmuf"])

	LocalizeElement("greenBody", locales["UrlAdvisorSetLocalContentOnlineGood"])
	LocalizeElement("greyBody", locales["UrlAdvisorSetLocalContentOnlineSuspicious"])
	LocalizeElement("redBody", locales["UrlAdvisorSetLocalContentOnlineDanger"])
	LocalizeElement("yellowBody", locales["UrlAdvisorSetLocalContentOnlineWmuf"])

}

AddEventListener(window, "load", function() 
{
	var m_balloonElement = document.getElementById("urlAdvisorBalloonBody");
	AddEventListener(m_balloonElement, "mouseout", OnMouseOut);
});

function OnMouseOut(mouseArgs)
{
	var relatedTarget = mouseArgs.relatedTarget || mouseArgs.toElement;
	// mouse out iframe
	if (!relatedTarget)
	{
		SendClose(0);
	}
}