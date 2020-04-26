AddEventListener(window, "load",
	function()
	{
		var button = document.getElementById("button");
		if (button)
		{
			AddEventListener(button, "click", OnClick);
			AddEventListener(button, "mouseover", OnMouseOver);
			AddEventListener(button, "mouseout", OnMouseOut);
		}
	});

function OnClick()
{
    SendData({ showKeyboard : true});
}

function OnMouseOver()
{
	var button = document.getElementById("button");
	button.style.filter = "alpha(opacity=60)";	// IE8
	button.style.opacity = 0.6;
}

function OnMouseOut()
{
	var button = document.getElementById("button");
	button.style.filter = "alpha(opacity=100)";	// IE8
	button.style.opacity = 1;
}