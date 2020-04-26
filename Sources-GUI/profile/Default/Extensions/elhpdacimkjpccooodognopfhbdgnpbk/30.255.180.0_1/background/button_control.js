function ButtonControl(factorySettings) {
    var defaultState = {};
    var button = chrome.browserAction;
    this.resetToFactory = function () {
        var factoryState = {
            badgeBackgroundColor: factorySettings.badgeBackgroundColor,
            badgeText: factorySettings.badgeText,
            label: factorySettings.label,
            iconId: factorySettings.iconId,
            enabled: factorySettings.enabled
        };
        this.setDefaultState(factoryState);
    };
    this.setDefaultState = function (state) {
        defaultState = state;
        this.setState(null, state);
    };
    this.setState = function (tabId, state) {
        var badgeText = state.badgeText || defaultState.badgeText;
        button.setBadgeText({
            tabId: tabId,
            text: badgeText
        });
        var badgeBackgroundColor = state.badgeBackgroundColor || defaultState.badgeBackgroundColor;
        if (badgeBackgroundColor) {
            button.setBadgeBackgroundColor({
                tabId: tabId,
                color: "#" + badgeBackgroundColor
            });
        }
        var iconId = state.iconId || defaultState.iconId;
        button.setIcon({
            tabId: tabId,
            path: getIconPath(iconId)
        });
        var label = state.label || defaultState.label;
        button.setTitle({
            tabId: tabId,
            title: label
        });
        var enabled = state.enabled || defaultState.enabled;
        enable(tabId, enabled);
    };
    function getIconPath(iconId) {
        var paths = {};
        ["19", "38"].forEach(function (size) {
            var path = "/images/button/{0}_{1}.png".
                replace("{0}", iconId).
                replace("{1}", size);
            paths[size] = chrome.extension.getURL(path);
        });
        return paths;
    }
    function enable(tabId, isEnabled) {
        if (isEnabled) {
            button.enable(tabId);
        }
        else {
            button.disable(tabId);
        }
    }
    this.resetToFactory();
}
