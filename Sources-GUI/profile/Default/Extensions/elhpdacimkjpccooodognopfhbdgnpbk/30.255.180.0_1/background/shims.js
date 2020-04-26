if (chrome.browserAction && !chrome.browserAction.setTitle)
    chrome.browserAction.setTitle = function () { };
if (!chrome.tabs.reload)
    chrome.tabs.reload = function () { chrome.tabs.executeScript({ code: 'window.location.reload()' }); };
