var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        function extend(to, from) {
            for (var p in from)
                if (from.hasOwnProperty(p))
                    to[p] = from[p];
            return to;
        }
        detail.extend = extend;
        function require(value, message) {
            if (!value)
                throw new Error(message);
        }
        detail.require = require;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        var PREFIX = 'framework_';
        var ID_ATTRIBUTE = PREFIX + 'id';
        function createHtmlElement(tagName) {
            return document.createElement(tagName);
        }
        detail.createHtmlElement = createHtmlElement;
        function insertChildNode(node, parent, insertAfter) {
            if (insertAfter === 1)
                parent.appendChild(node);
            else if (insertAfter === 0)
                parent.insertBefore(node, parent.firstChild);
            else
                parent.insertBefore(node, insertAfter.nextSibling);
        }
        detail.insertChildNode = insertChildNode;
        function moveNode(node, insertAfter) {
            var prevNode = node.previousSibling;
            if ((prevNode && insertAfter === prevNode) ||
                (!prevNode && insertAfter === 0) ||
                (!node.nextSibling && insertAfter === 1))
                return;
            var parent = node.parentNode;
            removeNode(node);
            insertChildNode(node, parent, insertAfter);
        }
        detail.moveNode = moveNode;
        function removeNode(node) {
            node.parentNode.removeChild(node);
        }
        detail.removeNode = removeNode;
        function clearNode(node) {
            while (node.firstChild)
                node.removeChild(node.firstChild);
        }
        detail.clearNode = clearNode;
        function getPrevNode(node) {
            return node && node.previousSibling;
        }
        detail.getPrevNode = getPrevNode;
        function getElementId(e) {
            return e && e.getAttribute && e.getAttribute(ID_ATTRIBUTE);
        }
        detail.getElementId = getElementId;
        function setElementId(e, id) {
            e.setAttribute(ID_ATTRIBUTE, id);
        }
        detail.setElementId = setElementId;
        function setAttribute(element, name, value) {
            element.setAttribute(name, value);
        }
        detail.setAttribute = setAttribute;
        function removeAttribute(element, name) {
            element.removeAttribute(name);
        }
        detail.removeAttribute = removeAttribute;
        function setTextContent(element, value) {
            if (typeof element.textContent !== 'undefined')
                element.textContent = value;
            else
                element.innerText = value;
        }
        detail.setTextContent = setTextContent;
        function addEventListener(target, event, listener) {
            if (target.addEventListener)
                target.addEventListener(event, listener, false);
            else
                target.attachEvent('on' + event, listener);
        }
        detail.addEventListener = addEventListener;
        function removeEventListener(target, event, listener) {
            if (target.removeEventListener)
                target.removeEventListener(event, listener, false);
            else
                target.detachEvent('on' + event, listener);
        }
        detail.removeEventListener = removeEventListener;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        function getChildrenSpec(spec) {
            var props = asGeneratedProps(spec);
            return props && props.children;
        }
        detail.getChildrenSpec = getChildrenSpec;
        function asGeneratedProps(spec) {
            return spec.props;
        }
        detail.asGeneratedProps = asGeneratedProps;
        function setGeneratedProps(spec, props) {
            if (!spec.props)
                spec.props = props;
            else
                detail.extend(spec.props, props);
        }
        detail.setGeneratedProps = setGeneratedProps;
        function convertToSpec(specOrText) {
            return isTextOrNumber(specOrText) ?
                { type: TextType, props: getTextProps(specOrText) }
                : specOrText;
        }
        detail.convertToSpec = convertToSpec;
        function getSpecType(specOrText) {
            return isTextOrNumber(specOrText) ? TextType
                : specOrText.type;
        }
        detail.getSpecType = getSpecType;
        function getSpecProps(specOrText) {
            return isTextOrNumber(specOrText) ? getTextProps(specOrText)
                : specOrText.props;
        }
        detail.getSpecProps = getSpecProps;
        function isTextOrNumber(value) {
            return typeof value === 'string' || typeof value === 'number';
        }
        var TextType = 'span';
        function getTextProps(specOrText) {
            return { textContent: String(specOrText) };
        }
        function getSpecKey(specOrText) {
            var props = getSpecProps(specOrText);
            return props && props.key && String(props.key);
        }
        detail.getSpecKey = getSpecKey;
        function isEmptySpec(specTree) {
            return !specTree && !isTextOrNumber(specTree);
        }
        detail.isEmptySpec = isEmptySpec;
        function forEachSpecChild(specTree, callback) {
            if (isEmptySpec(specTree))
                return;
            if (specTree instanceof Array) {
                for (var _i = 0, specTree_1 = specTree; _i < specTree_1.length; _i++) {
                    var spec = specTree_1[_i];
                    forEachSpecChild(spec, callback);
                }
            }
            else {
                callback(specTree);
            }
        }
        detail.forEachSpecChild = forEachSpecChild;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        var ComponentBase = (function () {
            function ComponentBase() {
            }
            ComponentBase.prototype.attachPrivateInstance = function (privateInstance) {
                this.privateInstance = privateInstance;
            };
            return ComponentBase;
        }());
        detail.ComponentBase = ComponentBase;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        function setDomProps(element, props, handlers) {
            if (handlers === void 0) { handlers = detail.AllDomProps; }
            handleProps(props, handlers, function (name, value, handler) { return handler.set(element, name, value); });
        }
        detail.setDomProps = setDomProps;
        function removeDomProps(element, props, handlers) {
            if (handlers === void 0) { handlers = detail.AllDomProps; }
            handleProps(props, handlers, function (name, value, handler) { return handler.remove(element, name, value); });
        }
        detail.removeDomProps = removeDomProps;
        var Aliases = {
            'className': 'class'
        };
        function handleProps(props, handlers, callback) {
            for (var name in props) {
                if (props.hasOwnProperty(name)) {
                    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                        var handler = handlers_1[_i];
                        if (handler.predicate(name)) {
                            var realName = Aliases.hasOwnProperty(name) ? Aliases[name] : name;
                            callback(realName, props[name], handler);
                            break;
                        }
                    }
                }
            }
        }
        var IgnoredNamesHandler = (function () {
            function IgnoredNamesHandler() {
            }
            IgnoredNamesHandler.prototype.predicate = function (name) {
                return IgnoredNamesHandler.IgnoredNames.hasOwnProperty(name);
            };
            IgnoredNamesHandler.prototype.set = function (element, name, value) { };
            IgnoredNamesHandler.prototype.remove = function (element, name, value) { };
            IgnoredNamesHandler.IgnoredNames = {
                'key': true,
                'children': true
            };
            return IgnoredNamesHandler;
        }());
        var DomEventsHandler = (function () {
            function DomEventsHandler() {
            }
            DomEventsHandler.prototype.predicate = function (name) {
                return name.indexOf('on') === 0;
            };
            DomEventsHandler.prototype.set = function (element, name, value) {
                detail.addEventListener(element, name.substring(2).toLowerCase(), value);
            };
            DomEventsHandler.prototype.remove = function (element, name, value) {
                detail.removeEventListener(element, name.substring(2).toLowerCase(), value);
            };
            return DomEventsHandler;
        }());
        var TextContentHandler = (function () {
            function TextContentHandler() {
            }
            TextContentHandler.prototype.predicate = function (name) {
                return name === 'textContent';
            };
            TextContentHandler.prototype.set = function (element, name, value) {
                detail.setTextContent(element, value);
            };
            TextContentHandler.prototype.remove = function (element, name, value) {
                detail.setTextContent(element, '');
            };
            return TextContentHandler;
        }());
        var DisabledAttributeHandler = (function () {
            function DisabledAttributeHandler() {
            }
            DisabledAttributeHandler.prototype.predicate = function (name) {
                return name === 'disabled';
            };
            DisabledAttributeHandler.prototype.set = function (element, name, value) {
                if (value)
                    detail.setAttribute(element, name, value);
                else
                    detail.removeAttribute(element, name);
            };
            DisabledAttributeHandler.prototype.remove = function (element, name, value) {
                detail.removeAttribute(element, name);
            };
            return DisabledAttributeHandler;
        }());
        var HtmlAttributeHandler = (function () {
            function HtmlAttributeHandler() {
            }
            HtmlAttributeHandler.prototype.predicate = function (name) {
                return true;
            };
            HtmlAttributeHandler.prototype.set = function (element, name, value) {
                detail.setAttribute(element, name, value);
            };
            HtmlAttributeHandler.prototype.remove = function (element, name, value) {
                detail.removeAttribute(element, name);
            };
            return HtmlAttributeHandler;
        }());
        detail.AllDomProps = [
            new IgnoredNamesHandler(),
            new DomEventsHandler(),
            new TextContentHandler(),
            new DisabledAttributeHandler(),
            new HtmlAttributeHandler()
        ];
        detail.DomEventsOnly = [
            new IgnoredNamesHandler(),
            new DomEventsHandler()
        ];
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        function createComponent(componentSpecOrText, parentElement, insertAfter) {
            if (insertAfter === void 0) { insertAfter = 1; }
            detail.require(!detail.isEmptySpec(componentSpecOrText), 'createComponent: empty spec');
            var spec = detail.convertToSpec(componentSpecOrText);
            var component = (typeof spec.type === 'string' ?
                (new PrivateDomComponent(spec))
                : new PrivateUserComponent(spec));
            component.mount(parentElement, insertAfter);
            return component;
        }
        function reconcileComponent(component, specOrText, parentElement, insertAfter) {
            if (insertAfter === void 0) { insertAfter = 1; }
            detail.require(!detail.isEmptySpec(specOrText), 'reconcileComponent: empty spec');
            if (component) {
                if (component.isSameComponent(specOrText)) {
                    component.updateProps(detail.getSpecProps(specOrText));
                    detail.moveNode(component.getElement(), insertAfter);
                    return component;
                }
                component.unmount();
            }
            return createComponent(specOrText, parentElement, insertAfter);
        }
        detail.reconcileComponent = reconcileComponent;
        var PrivateComponent = (function () {
            function PrivateComponent(componentSpec) {
                this.type = componentSpec.type;
                var key = componentSpec.props && componentSpec.props.key;
                if (key)
                    this.key = String(key);
            }
            PrivateComponent.prototype.isSameComponent = function (specOrText) {
                if (detail.getSpecType(specOrText) !== this.type)
                    return false;
                var props = detail.getSpecProps(specOrText);
                var thisKey = this.key || false;
                var specKey = (props && props.key) || false;
                return thisKey == specKey;
            };
            PrivateComponent.prototype.getKey = function () {
                return this.key;
            };
            return PrivateComponent;
        }());
        detail.PrivateComponent = PrivateComponent;
        var PrivateDomComponent = (function (_super) {
            __extends(PrivateDomComponent, _super);
            function PrivateDomComponent(componentSpec) {
                _super.call(this, componentSpec);
                this.tagName = componentSpec.type;
                this.childrenSpec = detail.getChildrenSpec(componentSpec);
                this.domProps = componentSpec.props;
            }
            PrivateDomComponent.prototype.mount = function (parentElement, insertAfter) {
                detail.require(!this.element, 'mount: already mounted');
                var element = detail.createHtmlElement(this.tagName);
                detail.insertChildNode(element, parentElement, insertAfter);
                detail.setDomProps(element, this.domProps);
                this.element = element;
                this.mountChildren(this.childrenSpec, this.element, 1);
            };
            PrivateDomComponent.prototype.updateProps = function (newProps) {
                var added = {};
                var updatedPrev = {};
                var updatedNew = {};
                var removed = {};
                var name;
                for (name in newProps) {
                    if (newProps.hasOwnProperty(name) && !this.domProps.hasOwnProperty(name)) {
                        added[name] = newProps[name];
                    }
                    else if (this.domProps[name] !== newProps[name]) {
                        updatedPrev[name] = this.domProps[name];
                        updatedNew[name] = newProps[name];
                    }
                }
                for (name in this.domProps)
                    if (this.domProps.hasOwnProperty(name) && !newProps.hasOwnProperty(name))
                        removed[name] = newProps[name];
                detail.removeDomProps(this.element, removed);
                detail.removeDomProps(this.element, updatedPrev, detail.DomEventsOnly);
                detail.setDomProps(this.element, updatedNew);
                detail.setDomProps(this.element, added);
                this.domProps = newProps;
                this.childrenSpec = newProps.children || null;
                this.reconcileChildren(this.childrenSpec, this.element, 0);
            };
            PrivateDomComponent.prototype.unmount = function () {
                detail.require(this.element, 'unmount: not mounted');
                detail.removeDomProps(this.element, this.domProps, detail.DomEventsOnly);
                detail.removeNode(this.element);
                this.element = null;
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.unmount();
                }
                this.children = null;
            };
            PrivateDomComponent.prototype.getElement = function () { return this.element; };
            PrivateDomComponent.prototype.mountChildren = function (specTree, parentElement, insertAfter) {
                detail.require(!this.children, 'mountChildren: already mounted');
                var children = [];
                detail.forEachSpecChild(specTree, function (specOrText) {
                    var component = createComponent(specOrText, parentElement, insertAfter);
                    insertAfter = component.getElement();
                    children.push(component);
                });
                this.children = children;
            };
            PrivateDomComponent.prototype.reconcileChildren = function (specTree, parentElement, insertAfter) {
                var keyedChildren = {};
                var otherChildren = [];
                for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var key = child.getKey();
                    if (key)
                        keyedChildren[key] = child;
                    else
                        otherChildren.push(child);
                }
                var otherChildrenIndex = 0;
                var reconciledChildren = [];
                detail.forEachSpecChild(specTree, function (specOrText) {
                    var component;
                    var specKey = detail.getSpecKey(specOrText);
                    if (specKey) {
                        if (keyedChildren.hasOwnProperty(specKey)) {
                            component = keyedChildren[specKey];
                            delete keyedChildren[specKey];
                            component = reconcileComponent(component, specOrText, parentElement, insertAfter);
                        }
                        else {
                            component = createComponent(specOrText, parentElement, insertAfter);
                        }
                    }
                    else {
                        component = reconcileComponent(otherChildren[otherChildrenIndex++], specOrText, parentElement, insertAfter);
                    }
                    insertAfter = component.getElement();
                    reconciledChildren.push(component);
                });
                for (; otherChildrenIndex < otherChildren.length; otherChildrenIndex++)
                    otherChildren[otherChildrenIndex].unmount();
                for (var key in keyedChildren)
                    if (keyedChildren.hasOwnProperty(key))
                        keyedChildren[key].unmount();
                this.children = reconciledChildren;
            };
            return PrivateDomComponent;
        }(PrivateComponent));
        var PrivateUserComponent = (function (_super) {
            __extends(PrivateUserComponent, _super);
            function PrivateUserComponent(componentSpec) {
                _super.call(this, componentSpec);
                this.publicInstance = new componentSpec.type(componentSpec.props);
                this.lifecycleObserver = this.publicInstance;
                this.publicInstance.attachPrivateInstance(this);
            }
            PrivateUserComponent.prototype.mount = function (parentElement, insertAfter) {
                detail.require(!this.child, 'mount: already mounted');
                if (this.lifecycleObserver.componentWillMount)
                    this.lifecycleObserver.componentWillMount();
                var childSpec = this.render();
                this.child = createComponent(childSpec, parentElement, insertAfter);
                this.parentElement = parentElement;
                if (this.lifecycleObserver.componentDidMount)
                    this.lifecycleObserver.componentDidMount();
            };
            PrivateUserComponent.prototype.updateProps = function (newProps) {
                if (this.lifecycleObserver.componentWillReceiveProps)
                    this.lifecycleObserver.componentWillReceiveProps(newProps);
                this.updatePropsAndState(newProps, this.publicInstance.state);
            };
            PrivateUserComponent.prototype.unmount = function () {
                detail.require(this.child, 'unmount: not mounted');
                if (this.lifecycleObserver.componentWillUnmount)
                    this.lifecycleObserver.componentWillUnmount();
                this.child.unmount();
                this.child = null;
                this.parentElement = null;
            };
            PrivateUserComponent.prototype.getElement = function () {
                return this.child.getElement();
            };
            PrivateUserComponent.prototype.updateState = function (newState) {
                this.updatePropsAndState(this.publicInstance.props, newState);
            };
            PrivateUserComponent.prototype.updatePropsAndState = function (newProps, newState) {
                if (this.lifecycleObserver.shouldComponentUpdate
                    && !this.lifecycleObserver.shouldComponentUpdate(newProps, newState))
                    return;
                if (this.lifecycleObserver.componentWillUpdate)
                    this.lifecycleObserver.componentWillUpdate(newProps, newState);
                var prevProps = this.publicInstance.props;
                var prevState = this.publicInstance.state;
                this.publicInstance.props = newProps;
                this.publicInstance.state = newState;
                var childSpec = this.render();
                this.child = reconcileComponent(this.child, childSpec, this.parentElement, detail.getPrevNode(this.getElement()) || 0);
                if (this.lifecycleObserver.componentDidUpdate)
                    this.lifecycleObserver.componentDidUpdate(prevProps, prevState);
            };
            PrivateUserComponent.prototype.render = function () {
                return this.publicInstance.render() || framework.createElement('noscript', {});
            };
            return PrivateUserComponent;
        }(PrivateComponent));
        detail.PrivateUserComponent = PrivateUserComponent;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var detail;
    (function (detail) {
        var ElementToComponentMap = (function () {
            function ElementToComponentMap() {
                this.nextElementId = 1;
                this.components = {};
            }
            ElementToComponentMap.prototype.get = function (element) {
                var id = detail.getElementId(element);
                return id && this.components[id];
            };
            ElementToComponentMap.prototype.set = function (element, component) {
                var id = detail.getElementId(element);
                if (id && this.components.hasOwnProperty(id))
                    this.components[id] = component;
                else
                    this.register(element, component);
            };
            ElementToComponentMap.prototype.register = function (element, component) {
                var id = String(this.nextElementId++);
                detail.setElementId(element, id);
                this.components[id] = component;
            };
            return ElementToComponentMap;
        }());
        detail.ElementToComponentMap = ElementToComponentMap;
    })(detail = framework.detail || (framework.detail = {}));
})(framework || (framework = {}));
var framework;
(function (framework) {
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(props) {
            _super.call(this);
            this.props = props;
        }
        Component.prototype.setState = function (newState) {
            this.privateInstance.updateState(newState);
        };
        return Component;
    }(framework.detail.ComponentBase));
    framework.Component = Component;
    function createElement(type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var spec = {
            type: type,
            props: props
        };
        if (children.length)
            framework.detail.setGeneratedProps(spec, { children: children });
        return spec;
    }
    framework.createElement = createElement;
    var gRootComponents = new framework.detail.ElementToComponentMap();
    function render(rootComponentSpec, container) {
        var rootComponent = gRootComponents.get(container);
        if (!rootComponent)
            framework.detail.clearNode(container);
        rootComponent = framework.detail.reconcileComponent(rootComponent, rootComponentSpec, container);
        gRootComponents.set(container, rootComponent);
    }
    framework.render = render;
    var Children = (function () {
        function Children() {
        }
        Children.count = function (children) {
            var count = 0;
            framework.detail.forEachSpecChild(children, function (child) { return count++; });
            return count;
        };
        return Children;
    }());
    framework.Children = Children;
})(framework || (framework = {}));
var l10n = null;
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var LocalizedStringsIds = [
            'PopupLeftToRight',
            'PopupCustomizationCss',
            'PopupVirtualKeyboardTitle',
            'PopupAntiBannerTitle',
            'PopupAntiBannerButtonEnableTask',
            'PopupAntiBannerButtonCheckLicense',
            'PopupAntiBannerButtonCheckSubscription',
            'PopupAntiBannerTextTaskDisabled',
            'PopupAntiBannerTextCheckLicense',
            'PopupAntiBannerTextBlockedBannersCount',
            'PopupAntiBannerTextBlockingDisabledOnThisSite',
            'PopupAntiBannerSmallTextBlockingDisabledOnIncompatibleSite',
            'PopupAntiBannerSmallTextBlockingDisabledOnPartnerSite',
            'PopupAntiBannerMenuItemEnableBlockingOnSite',
            'PopupAntiBannerMenuItemDisableBlockingOnSite',
            'PopupAntiBannerMenuItemDisableTask',
            'PopupAntiBannerMenuItemSettings',
            'PopupAntiBannerMenuItemHelp',
            'PopupAntiBannerHelpUrl',
            'PopupAntiBannerBannersWillBeBlockedAfterPageReload',
            'PopupAntiBannerReloadPageToSeeAdvertisement',
            'PopupDntTitle',
            'PopupDntButtonEnableTask',
            'PopupDntButtonCheckLicense',
            'PopupDntButtonCheckSubscription',
            'PopupDntTextTaskDisabled',
            'PopupDntTextCheckLicense',
            'PopupDntTextBlockingDisabled',
            'PopupDntTextBlockingDisabledOnThisSite',
            'PopupDntTextBlockedTrackersCount',
            'PopupDntTextDetectedTrackersCount',
            'PopupDntSmallTextBlockingDisabledOnIncompatibleSite',
            'PopupDntSmallTextBlockingDisabledOnPartnerSite',
            'PopupDntCategoryTitleSocialNetworks',
            'PopupDntCategoryTitleWebAnalytics',
            'PopupDntCategoryTitleAdAgencies',
            'PopupDntCategoryTitleWebBugs',
            'PopupDntCategoryTitleNoteNotBlocked',
            'PopupDntCategoryTitleNotePartiallyBlocked',
            'PopupDntTrackerNoteNotBlocked',
            'PopupDntMenuItemShowBlockingFailures',
            'PopupDntMenuItemEnableBlocking',
            'PopupDntMenuItemDisableBlocking',
            'PopupDntMenuItemEnableBlockingOnThisSite',
            'PopupDntMenuItemDisableBlockingOnThisSite',
            'PopupDntMenuItemSettings',
            'PopupDntMenuItemHelp',
            'PopupDntHelpUrl'
        ];
        function initializeLocalization(loader, callback) {
            loader.loadStrings({ ids: LocalizedStringsIds }, function (l10n_) {
                l10n = l10n_;
                callback();
            });
        }
        popup.initializeLocalization = initializeLocalization;
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var AreaHeader = (function (_super) {
                __extends(AreaHeader, _super);
                function AreaHeader() {
                    _super.apply(this, arguments);
                }
                AreaHeader.prototype.render = function () {
                    var iconId = this.props.iconId + (this.props.iconDisabled ? "_disabled" : "");
                    return popup.ELEMENT('div', {
                        className: "area-header" +
                            (this.props.expandable ?
                                " area-expandable" + (this.props.expanded ? '_expanded' : '')
                                : (this.props.onClick ? " area-header_active" : " area-header_disabled")),
                        onClick: this.props.onClick || (function () { })
                    }, popup.ELEMENT('div', { className: "area-headerTitle" }, popup.ELEMENT('div', { className: "area-icon " + iconId }, this.props.isLocked ? popup.ELEMENT('div', { className: "shield-icon" }) : null), popup.ELEMENT('div', { className: "area-title" }, this.props.title), popup.ELEMENT('div', { className: "clear" })), this.renderDetails());
                };
                AreaHeader.prototype.renderDetails = function () {
                    if (!(this.props.text || this.props.text2 || this.props.text || this.props.onEnableButton))
                        return null;
                    return popup.ELEMENT('div', { className: "area-headerDetails" }, popup.ELEMENT('div', { className: "area-headerDetailsMainColumn" }, this.props.text ?
                        popup.ELEMENT('div', { className: "area-text" }, this.props.text) : null, this.props.text2 ?
                        popup.ELEMENT('div', { className: "area-text" }, this.props.text2) : null, this.props.smallText ?
                        popup.ELEMENT('div', { className: "area-textSmall" }, this.props.smallText) : null), this.props.onEnableButton ?
                        popup.ELEMENT('div', { className: "area-headerDetailsRightColumn" }, popup.ELEMENT('button', {
                            className: this.props.isRedEnableButton ?
                                "area-advertiseButton" : "area-enableButton",
                            onClick: this.props.onEnableButton
                        }, this.props.enableButtonLabel))
                        : null);
                };
                return AreaHeader;
            }(framework.Component));
            elements.AreaHeader = AreaHeader;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var AreaBody = (function (_super) {
                __extends(AreaBody, _super);
                function AreaBody() {
                    _super.apply(this, arguments);
                }
                AreaBody.prototype.render = function () {
                    if (framework.Children.count(this.props.children) === 0)
                        return null;
                    return popup.ELEMENT('div', { className: "area-body" }, popup.ELEMENT('div', { className: "area-bodySeparator" }), popup.ELEMENT('div', { className: "area-bodyContent" + (this.props.scrollable ? ' scrollable-content' : '') }, this.props.children));
                };
                return AreaBody;
            }(framework.Component));
            elements.AreaBody = AreaBody;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var Menu = (function (_super) {
                __extends(Menu, _super);
                function Menu() {
                    _super.apply(this, arguments);
                }
                Menu.prototype.render = function () {
                    return popup.ELEMENT('ul', { className: "area-menu" }, this.props.children);
                };
                return Menu;
            }(framework.Component));
            elements.Menu = Menu;
            var MenuItem = (function (_super) {
                __extends(MenuItem, _super);
                function MenuItem() {
                    _super.apply(this, arguments);
                }
                MenuItem.prototype.render = function () {
                    return popup.ELEMENT('li', null, popup.ELEMENT('button', {
                        className: 'area-menu-link' +
                            (this.props.isWarning ? ' area-menu-link_warning' : ''),
                        disabled: !this.props.onClick,
                        onClick: this.props.onClick || (function () { })
                    }, this.props.text));
                };
                return MenuItem;
            }(framework.Component));
            elements.MenuItem = MenuItem;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var DntTrackersTree = (function (_super) {
                __extends(DntTrackersTree, _super);
                function DntTrackersTree(props) {
                    _super.call(this, props);
                    this.state = { expandedCategory: null };
                }
                DntTrackersTree.prototype.render = function () {
                    return popup.ELEMENT('ul', { className: 'dnt-category' }, popup.ELEMENT(DntCategory, this.makeCategoryProps(0)), popup.ELEMENT(DntCategory, this.makeCategoryProps(1)), popup.ELEMENT(DntCategory, this.makeCategoryProps(3)), popup.ELEMENT(DntCategory, this.makeCategoryProps(2)));
                };
                DntTrackersTree.prototype.componentDidUpdate = function (prevProps, prevState) {
                    this.props.onInternalResize();
                };
                DntTrackersTree.prototype.makeCategoryProps = function (category) {
                    var _this = this;
                    return {
                        title: supportedCategories[category].getTitle(),
                        iconId: supportedCategories[category].getIconId(),
                        blockingMode: supportedCategories[category].getCategoryBlockingMode(this.props.trackingSettings),
                        isBlockingDisabledByUser: this.props.isBlockingDisabledByUser,
                        trackers: this.getTrackersForCategory(category),
                        expanded: this.state.expandedCategory === category,
                        onExpand: function () { return _this.onCategoryExpanded(category); }
                    };
                };
                DntTrackersTree.prototype.getTrackersForCategory = function (category) {
                    var result = [];
                    for (var _i = 0, _a = this.props.detections; _i < _a.length; _i++) {
                        var detection = _a[_i];
                        if (detection.category !== category)
                            continue;
                        result.push({
                            trackerName: detection.trackerName,
                            count: detection.count,
                            blocked: supportedCategories[category].isBlockedTracker(detection.trackerName, this.props.trackingSettings)
                        });
                    }
                    return result;
                };
                DntTrackersTree.prototype.onCategoryExpanded = function (category) {
                    this.setState(this.state.expandedCategory == category ?
                        { expandedCategory: null } :
                        { expandedCategory: category });
                };
                return DntTrackersTree;
            }(framework.Component));
            elements.DntTrackersTree = DntTrackersTree;
            var SocialNetworkCategory = (function () {
                function SocialNetworkCategory() {
                }
                SocialNetworkCategory.prototype.getTitle = function () { return l10n('PopupDntCategoryTitleSocialNetworks'); };
                SocialNetworkCategory.prototype.getIconId = function () { return 'social-networks'; };
                SocialNetworkCategory.prototype.getCategoryBlockingMode = function (settings) {
                    var blockedCount = 0;
                    for (var _i = 0, _a = settings.socialNetworkSettings; _i < _a.length; _i++) {
                        var network = _a[_i];
                        if (network.block)
                            blockedCount++;
                    }
                    var networksCount = settings.socialNetworkSettings.length;
                    return blockedCount === networksCount ? 2
                        : (blockedCount === 0 ? 0
                            : 1);
                };
                SocialNetworkCategory.prototype.isBlockedTracker = function (trackerName, settings) {
                    for (var _i = 0, _a = settings.socialNetworkSettings; _i < _a.length; _i++) {
                        var network = _a[_i];
                        if (network.name === trackerName)
                            return network.block;
                    }
                    return false;
                };
                return SocialNetworkCategory;
            }());
            var NormalCategory = (function () {
                function NormalCategory() {
                }
                NormalCategory.prototype.getCategoryBlockingMode = function (settings) {
                    return this.isBlocked(settings) ? 2 : 0;
                };
                NormalCategory.prototype.isBlockedTracker = function (trackerName, settings) {
                    return this.isBlocked(settings);
                };
                return NormalCategory;
            }());
            var WebAnalyticsCategory = (function (_super) {
                __extends(WebAnalyticsCategory, _super);
                function WebAnalyticsCategory() {
                    _super.apply(this, arguments);
                }
                WebAnalyticsCategory.prototype.getTitle = function () { return l10n('PopupDntCategoryTitleWebAnalytics'); };
                WebAnalyticsCategory.prototype.getIconId = function () { return 'web-analytics'; };
                WebAnalyticsCategory.prototype.isBlocked = function (settings) { return settings.blockWebAnalytics; };
                return WebAnalyticsCategory;
            }(NormalCategory));
            var WebBugsCategory = (function (_super) {
                __extends(WebBugsCategory, _super);
                function WebBugsCategory() {
                    _super.apply(this, arguments);
                }
                WebBugsCategory.prototype.getTitle = function () { return l10n('PopupDntCategoryTitleWebBugs'); };
                WebBugsCategory.prototype.getIconId = function () { return 'web-bugs'; };
                WebBugsCategory.prototype.isBlocked = function (settings) { return settings.blockWebBugs; };
                return WebBugsCategory;
            }(NormalCategory));
            var AdAgenciesCategory = (function (_super) {
                __extends(AdAgenciesCategory, _super);
                function AdAgenciesCategory() {
                    _super.apply(this, arguments);
                }
                AdAgenciesCategory.prototype.getTitle = function () { return l10n('PopupDntCategoryTitleAdAgencies'); };
                AdAgenciesCategory.prototype.getIconId = function () { return 'ad-agencies'; };
                AdAgenciesCategory.prototype.isBlocked = function (settings) { return settings.blockAdAgencies; };
                return AdAgenciesCategory;
            }(NormalCategory));
            var supportedCategories = {};
            supportedCategories[0] = new SocialNetworkCategory();
            supportedCategories[1] = new WebAnalyticsCategory();
            supportedCategories[3] = new WebBugsCategory();
            supportedCategories[2] = new AdAgenciesCategory();
            var DntCategory = (function (_super) {
                __extends(DntCategory, _super);
                function DntCategory() {
                    _super.apply(this, arguments);
                }
                DntCategory.prototype.render = function () {
                    return popup.ELEMENT('li', { className: 'dnt-category' }, this.renderHeader(), this.props.expanded ?
                        popup.ELEMENT('ul', { className: 'dnt-category-content dnt-trackers' }, this.renderTrackers())
                        : null);
                };
                DntCategory.prototype.renderHeader = function () {
                    var notBlocked = this.props.blockingMode === 0;
                    return popup.ELEMENT('div', { className: 'dnt-category-header', onClick: this.props.onExpand }, popup.ELEMENT('button', {
                        className: 'dnt-category-expandButton' +
                            (this.props.expanded ? ' dnt-category-expandButton_expanded' : '')
                    }), popup.ELEMENT('div', { className: 'dnt-category-icon' +
                            (notBlocked ? ' dnt-category-icon_disabled' : '') +
                            ' ' + this.props.iconId + (notBlocked ? '_disabled' : '_enabled')
                    }), popup.ELEMENT('div', { className: 'dnt-category-title' }, this.props.title, ': ', popup.ELEMENT('span', { className: 'dnt-category-counter' }, this.getTotalCounter()), (this.props.blockingMode === 2
                        || this.props.isBlockingDisabledByUser) ?
                        null
                        : [
                            ' ',
                            popup.ELEMENT('span', { className: 'dnt-category-title-note' }, notBlocked ?
                                l10n('PopupDntCategoryTitleNoteNotBlocked')
                                : l10n('PopupDntCategoryTitleNotePartiallyBlocked'))
                        ]));
                };
                DntCategory.prototype.renderTrackers = function () {
                    var showBlockingMode = this.props.blockingMode === 1;
                    var trackers = [];
                    for (var _i = 0, _a = this.props.trackers; _i < _a.length; _i++) {
                        var tracker = _a[_i];
                        trackers.push(popup.ELEMENT('li', {
                            className: tracker.blocked ? 'dnt-tracker-name-blocked' : 'dnt-tracker-name'
                        }, tracker.trackerName, ': ', popup.ELEMENT('span', { className: 'dnt-tracker-counter' }, tracker.count), showBlockingMode && !tracker.blocked ?
                            [
                                ' ',
                                popup.ELEMENT('span', { className: 'dnt-tracker-note' }, l10n('PopupDntTrackerNoteNotBlocked'))
                            ]
                            : null));
                    }
                    return trackers;
                };
                DntCategory.prototype.getTotalCounter = function () {
                    var counter = 0;
                    for (var _i = 0, _a = this.props.trackers; _i < _a.length; _i++) {
                        var detection = _a[_i];
                        counter += detection.count;
                    }
                    return counter;
                };
                return DntCategory;
            }(framework.Component));
            elements.DntCategory = DntCategory;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var AreaId = 'dnt';
            var DntArea = (function (_super) {
                __extends(DntArea, _super);
                function DntArea() {
                    _super.apply(this, arguments);
                }
                DntArea.prototype.render = function () {
                    return popup.ELEMENT('div', { className: "area", id: AreaId }, this.renderAreaHeader(), this.renderAreaBody());
                };
                DntArea.prototype.renderAreaHeader = function () {
                    var _this = this;
                    var data = this.getData();
                    return popup.ELEMENT(elements.AreaHeader, {
                        title: l10n('PopupDntTitle'),
                        expanded: this.props.expanded,
                        expandable: this.isAreaEnabled(),
                        onClick: this.isAreaEnabled() ? function () { return _this.props.onExpand(); } : null,
                        iconId: 'dnt-area-icon',
                        iconDisabled: !this.isAreaEnabled() ||
                            !data.blockingEnabled ||
                            data.thisSiteBlockingStatus !== 0,
                        isLocked: this.props.settings.restrictionMode == 2,
                        isRedEnableButton: this.props.settings.restrictionMode == 2,
                        text: this.getText(),
                        text2: this.getText2(),
                        smallText: this.getSmallText(),
                        onEnableButton: this.getEnableButtonClickHandler(),
                        enableButtonLabel: (this.props.settings.restrictionMode == 2 ?
                            l10n('PopupDntButtonCheckSubscription') : (this.props.settings.restrictionMode == 1 ?
                            l10n('PopupDntButtonCheckLicense') :
                            l10n('PopupDntButtonEnableTask')))
                    });
                };
                DntArea.prototype.renderAreaBody = function () {
                    var data = this.getData();
                    return popup.ELEMENT(elements.AreaBody, {
                        scrollable: this.props.expanded
                    }, !this.isAreaEnabled() ? null
                        : (this.props.expanded ?
                            [
                                isIncompatibleOrPartnerSite(data) ?
                                    null
                                    : popup.ELEMENT(elements.DntTrackersTree, {
                                        trackingSettings: data.trackingSettings,
                                        isBlockingDisabledByUser: this.isBlockingDisabledByUser(),
                                        detections: data.detections || [],
                                        onInternalResize: this.props.onInternalResize,
                                        key: "dnt-tree"
                                    }),
                                this.renderExpandedMenu()
                            ]
                            : this.renderCollapsedMenu()));
                };
                DntArea.prototype.renderExpandedMenu = function () {
                    var _this = this;
                    var data = this.getData();
                    return popup.ELEMENT(elements.Menu, null, ((data.blockingEnabled &&
                        data.thisSiteBlockingStatus === 0 &&
                        data.blockingFailed)
                        ?
                            popup.ELEMENT(elements.MenuItem, {
                                text: l10n('PopupDntMenuItemShowBlockingFailures'),
                                onClick: function () { return _this.onOpenReportUi(); },
                                isWarning: true
                            })
                        : null), (!data.blockingEnabled ||
                        isIncompatibleOrPartnerSite(data) ||
                        !data.thisSiteDomain ?
                        popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemDisableBlockingOnThisSite') })
                        : (data.thisSiteBlockingStatus === 1 ?
                            popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemEnableBlockingOnThisSite'), onClick: function () { return _this.onEnableBlockingOnSite(true); } })
                            : popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemDisableBlockingOnThisSite'), onClick: function () { return _this.onEnableBlockingOnSite(false); } }))), (data.blockingEnabled ?
                        popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemDisableBlocking'), onClick: function () { return _this.onEnableBlocking(false); } })
                        : popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemEnableBlocking'), onClick: function () { return _this.onEnableBlocking(true); } })), popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemSettings'), onClick: function () { return _this.onSettings(); } }), popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemHelp'), onClick: function () { return _this.onHelp(); } }));
                };
                DntArea.prototype.renderCollapsedMenu = function () {
                    var _this = this;
                    var data = this.getData();
                    if (isIncompatibleOrPartnerSite(data))
                        return null;
                    if (!data.blockingEnabled)
                        return popup.ELEMENT(elements.Menu, null, popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemEnableBlocking'), onClick: function () { return _this.onEnableBlocking(true); } }));
                    if (data.thisSiteBlockingStatus === 1)
                        return popup.ELEMENT(elements.Menu, null, popup.ELEMENT(elements.MenuItem, { text: l10n('PopupDntMenuItemEnableBlockingOnThisSite'), onClick: function () { return _this.onEnableBlockingOnSite(true); } }));
                    if (data.thisSiteBlockingStatus === 0 &&
                        data.blockingFailed)
                        return popup.ELEMENT(elements.Menu, null, popup.ELEMENT(elements.MenuItem, {
                            text: l10n('PopupDntMenuItemShowBlockingFailures'),
                            onClick: function () { return _this.onOpenReportUi(); },
                            isWarning: true
                        }));
                    return null;
                };
                DntArea.prototype.getEnableButtonClickHandler = function () {
                    var _this = this;
                    if (this.props.settings.restrictionMode == 2)
                        return function () { return _this.props.controller.sendCommand(AreaId, 'extend_subscription'); };
                    if (this.props.settings.restrictionMode == 1)
                        return function () { return _this.props.controller.sendCommand(AreaId, 'license_info'); };
                    if (!this.props.data.taskEnabled)
                        return function () { return _this.props.controller.sendCommand(AreaId, 'EnableDntTask', { enable: true }); };
                    return null;
                };
                DntArea.prototype.onEnableBlocking = function (enable) {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'EnableDntBlocking', { enable: enable }, function (error) {
                        if (!error)
                            _this.props.controller.reloadActiveTab();
                    });
                };
                DntArea.prototype.onEnableBlockingOnSite = function (enable) {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'EnableDntBlockingOnSite', { enable: enable }, function (error) {
                        if (!error)
                            _this.props.controller.reloadActiveTab();
                    });
                };
                DntArea.prototype.onSettings = function () {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'OpenDntSettingsUi', null, function () {
                        return _this.props.popupWindow.close();
                    });
                };
                DntArea.prototype.onOpenReportUi = function () {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'OpenDntReportsUi', null, function () {
                        return _this.props.popupWindow.close();
                    });
                };
                DntArea.prototype.onHelp = function () {
                    var _this = this;
                    this.props.controller.openWebPageInNewTab(l10n('PopupDntHelpUrl'));
                    setTimeout(function () { return _this.props.popupWindow.close(); }, 400);
                };
                DntArea.prototype.getText = function () {
                    var data = this.getData();
                    if (!this.isAreaEnabled())
                        return (this.props.settings.restrictionMode == 1 ?
                            l10n('PopupDntTextCheckLicense') : l10n('PopupDntTextTaskDisabled'));
                    if (isIncompatibleOrPartnerSite(data))
                        return l10n('PopupDntTextBlockingDisabledOnThisSite');
                    if (!data.blockingEnabled)
                        return l10n('PopupDntTextBlockingDisabled');
                    if (data.thisSiteBlockingStatus === 1)
                        return l10n('PopupDntTextBlockingDisabledOnThisSite');
                    return l10n('PopupDntTextBlockedTrackersCount').replace('{}', this.getTotalCounter());
                };
                DntArea.prototype.getText2 = function () {
                    var data = this.getData();
                    if (!this.isAreaEnabled())
                        return null;
                    return this.isBlockingDisabledByUser() ?
                        l10n('PopupDntTextDetectedTrackersCount').replace('{}', this.getTotalCounter())
                        : null;
                };
                DntArea.prototype.getSmallText = function () {
                    var data = this.getData();
                    if (!this.isAreaEnabled() || !isIncompatibleOrPartnerSite(data))
                        return null;
                    switch (data.thisSiteBlockingStatus) {
                        case 2:
                            return l10n('PopupDntSmallTextBlockingDisabledOnIncompatibleSite').replace('{}', data.thisSiteDomain);
                        case 3:
                            return l10n('PopupDntSmallTextBlockingDisabledOnPartnerSite').replace('{}', data.thisSiteDomain);
                    }
                    return null;
                };
                DntArea.prototype.getTotalCounter = function () {
                    var result = 0;
                    for (var _i = 0, _a = this.getData().detections || []; _i < _a.length; _i++) {
                        var d = _a[_i];
                        result += d.count;
                    }
                    return String(result);
                };
                DntArea.prototype.getData = function () { return this.props.data; };
                DntArea.prototype.isAreaEnabled = function () {
                    return !this.props.settings.restrictionMode &&
                        this.props.data.taskEnabled;
                };
                DntArea.prototype.isBlockingDisabledByUser = function () {
                    var data = this.getData();
                    return (!isIncompatibleOrPartnerSite(data) &&
                        (!data.blockingEnabled ||
                            data.thisSiteBlockingStatus === 1));
                };
                return DntArea;
            }(framework.Component));
            elements.DntArea = DntArea;
            function isIncompatibleOrPartnerSite(data) {
                return data.thisSiteBlockingStatus === 2 ||
                    data.thisSiteBlockingStatus === 3;
            }
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var AreaId = 'ab';
            var AntiBannerArea = (function (_super) {
                __extends(AntiBannerArea, _super);
                function AntiBannerArea() {
                    _super.apply(this, arguments);
                }
                AntiBannerArea.prototype.render = function () {
                    return popup.ELEMENT('div', { className: "area", id: AreaId }, this.renderAreaHeader(), this.renderAreaBody());
                };
                AntiBannerArea.prototype.renderAreaHeader = function () {
                    var _this = this;
                    var data = this.getData();
                    return popup.ELEMENT(elements.AreaHeader, {
                        title: l10n('PopupAntiBannerTitle'),
                        expanded: this.props.expanded,
                        expandable: this.isAreaEnabled(),
                        onClick: this.isAreaEnabled() ? function () { return _this.props.onExpand(); } : null,
                        iconId: 'antibanner-area-icon',
                        iconDisabled: !this.isAreaEnabled() ||
                            data.thisSiteBlockingStatus !== 0,
                        isLocked: this.props.settings.restrictionMode == 2,
                        isRedEnableButton: this.props.settings.restrictionMode == 2,
                        text: this.getText(),
                        smallText: this.getSmallText(),
                        onEnableButton: this.getEnableButtonClickHandler(),
                        enableButtonLabel: (this.props.settings.restrictionMode == 2 ?
                            l10n('PopupAntiBannerButtonCheckSubscription') : (this.props.settings.restrictionMode == 1 ?
                            l10n('PopupAntiBannerButtonCheckLicense') :
                            l10n('PopupAntiBannerButtonEnableTask')))
                    });
                };
                AntiBannerArea.prototype.renderAreaBody = function () {
                    var data = this.getData();
                    return popup.ELEMENT(elements.AreaBody, {
                        scrollable: this.props.expanded
                    }, !this.isAreaEnabled() ? null
                        : (this.props.expanded ?
                            this.renderExpandedMenu()
                            : this.renderCollapsedMenu()));
                };
                AntiBannerArea.prototype.renderExpandedMenu = function () {
                    var _this = this;
                    var data = this.getData();
                    return popup.ELEMENT(elements.Menu, null, (isIncompatibleOrPartnerSite(data) ||
                        !data.thisSiteDomain ?
                        popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemDisableBlockingOnSite') })
                        : (data.thisSiteBlockingStatus === 1 ?
                            popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemEnableBlockingOnSite'), onClick: function () { return _this.onEnableBlockingOnSite(true); } })
                            : popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemDisableBlockingOnSite'), onClick: function () { return _this.onEnableBlockingOnSite(false); } }))), popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemDisableTask'), onClick: function () { return _this.onEnableTask(false); } }), popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemSettings'), onClick: function () { return _this.onSettings(); } }), popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemHelp'), onClick: function () { return _this.onHelp(); } }));
                };
                AntiBannerArea.prototype.renderCollapsedMenu = function () {
                    var _this = this;
                    var data = this.getData();
                    return (data.thisSiteBlockingStatus == 1 ?
                        popup.ELEMENT(elements.Menu, null, popup.ELEMENT(elements.MenuItem, { text: l10n('PopupAntiBannerMenuItemEnableBlockingOnSite'), onClick: function () { return _this.onEnableBlockingOnSite(true); } }))
                        : null);
                };
                AntiBannerArea.prototype.getEnableButtonClickHandler = function () {
                    var _this = this;
                    if (this.props.settings.restrictionMode == 2)
                        return function () { return _this.props.controller.sendCommand(AreaId, 'extend_subscription'); };
                    if (this.props.settings.restrictionMode == 1)
                        return function () { return _this.props.controller.sendCommand(AreaId, 'license_info'); };
                    if (!this.props.data.taskEnabled)
                        return function () { return _this.onEnableTask(true); };
                    return null;
                };
                AntiBannerArea.prototype.onEnableTask = function (enable) {
                    this.props.controller.sendCommand(AreaId, 'EnableAntiBannerTask', { enable: enable });
                };
                AntiBannerArea.prototype.onEnableBlockingOnSite = function (enable) {
                    this.props.controller.sendCommand(AreaId, 'EnableAntiBannerBlockingOnSite', { enable: enable });
                };
                AntiBannerArea.prototype.onSettings = function () {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'OpenAntiBannerSettingsUi', null, function () {
                        return _this.props.popupWindow.close();
                    });
                };
                AntiBannerArea.prototype.onHelp = function () {
                    var _this = this;
                    this.props.controller.openWebPageInNewTab(l10n('PopupAntiBannerHelpUrl'));
                    setTimeout(function () { return _this.props.popupWindow.close(); }, 400);
                };
                AntiBannerArea.prototype.getText = function () {
                    var data = this.getData();
                    if (data.isRefreshRequired) {
                        if (data.thisSiteBlockingStatus == 0 && this.isAreaEnabled()) {
                            return l10n('PopupAntiBannerBannersWillBeBlockedAfterPageReload');
                        }
                        else if (data.thisSiteBlockingStatus == 1 || !this.isAreaEnabled()) {
                            return l10n('PopupAntiBannerReloadPageToSeeAdvertisement');
                        }
                    }
                    if (!this.isAreaEnabled())
                        return (this.props.settings.restrictionMode == 1 ?
                            l10n('PopupAntiBannerTextCheckLicense') : l10n('PopupAntiBannerTextTaskDisabled'));
                    if (data.thisSiteBlockingStatus != 0)
                        return l10n('PopupAntiBannerTextBlockingDisabledOnThisSite');
                    return l10n('PopupAntiBannerTextBlockedBannersCount').replace('{}', String(data.blockedBannersCount));
                };
                AntiBannerArea.prototype.getSmallText = function () {
                    var data = this.getData();
                    if (!this.isAreaEnabled())
                        return null;
                    switch (data.thisSiteBlockingStatus) {
                        case 3:
                            return l10n('PopupAntiBannerSmallTextBlockingDisabledOnIncompatibleSite').replace('{}', data.thisSiteDomain);
                        case 2:
                            return l10n('PopupAntiBannerSmallTextBlockingDisabledOnPartnerSite').replace('{}', data.thisSiteDomain);
                    }
                    return null;
                };
                AntiBannerArea.prototype.getData = function () { return this.props.data; };
                AntiBannerArea.prototype.isAreaEnabled = function () {
                    return !this.props.settings.restrictionMode &&
                        this.props.data.taskEnabled;
                };
                return AntiBannerArea;
            }(framework.Component));
            elements.AntiBannerArea = AntiBannerArea;
            function isIncompatibleOrPartnerSite(data) {
                return data.thisSiteBlockingStatus === 3 ||
                    data.thisSiteBlockingStatus === 2;
            }
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var AreaId = 'vk';
            var VirtualKeyboardArea = (function (_super) {
                __extends(VirtualKeyboardArea, _super);
                function VirtualKeyboardArea() {
                    _super.apply(this, arguments);
                }
                VirtualKeyboardArea.prototype.render = function () {
                    var _this = this;
                    return popup.ELEMENT('div', { className: "area", id: AreaId }, popup.ELEMENT(elements.AreaHeader, {
                        title: l10n('PopupVirtualKeyboardTitle'),
                        expandable: false,
                        isLocked: false,
                        onClick: function () { return _this.onClick(); },
                        iconId: 'vkbd-area-icon'
                    }));
                };
                VirtualKeyboardArea.prototype.onClick = function () {
                    var _this = this;
                    this.props.controller.sendCommand(AreaId, 'ShowVirtualKeyboard', null, function () {
                        return _this.props.popupWindow.close();
                    });
                };
                return VirtualKeyboardArea;
            }(framework.Component));
            elements.VirtualKeyboardArea = VirtualKeyboardArea;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        var elements;
        (function (elements) {
            var SupportedAreas = [
                { id: 'dnt', element: elements.DntArea },
                { id: 'ab', element: elements.AntiBannerArea },
                { id: 'vk', element: elements.VirtualKeyboardArea }
            ];
            var Popup = (function (_super) {
                __extends(Popup, _super);
                function Popup(props) {
                    _super.call(this, props);
                    this.state = { expandedArea: null };
                }
                Popup.prototype.render = function () {
                    return popup.ELEMENT('div', { className: "popup" }, popup.ELEMENT('div', { className: "popup-body" }, this.renderAreas()), popup.ELEMENT('div', { className: "popup-footer" }, popup.ELEMENT('div', { className: "logo" })));
                };
                Popup.prototype.renderAreas = function () {
                    var _this = this;
                    var data = this.props.data;
                    var areas = [];
                    var _loop_1 = function(area) {
                        if (!data.hasOwnProperty(area.id) || data[area.id].areaDisabled)
                            return "continue";
                        areas.push(popup.ELEMENT('div', { className: 'popup-section' }, popup.ELEMENT(area.element, {
                            data: data[area.id],
                            settings: this_1.props.settings,
                            expanded: this_1.state.expandedArea == area.id,
                            controller: this_1.props.controller,
                            popupWindow: this_1.props.popupWindow,
                            onExpand: function () { return _this.onAreaExpand(area.id); },
                            onInternalResize: function () { return _this.onAreaInternalResize(); }
                        })));
                    };
                    var this_1 = this;
                    for (var _i = 0, SupportedAreas_1 = SupportedAreas; _i < SupportedAreas_1.length; _i++) {
                        var area = SupportedAreas_1[_i];
                        var state_1 = _loop_1(area);
                        if (state_1 === "continue") continue;
                    }
                    if (areas.length == 0)
                        return null;
                    var result = [areas[0]];
                    for (var i = 1; i < areas.length; i++) {
                        result.push(popup.ELEMENT('div', { className: "popup-sectionSeparator" }));
                        result.push(areas[i]);
                    }
                    return result;
                };
                Popup.prototype.componentDidUpdate = function (prevProps, prevState) {
                    this.props.onSizeChanged();
                };
                Popup.prototype.componentDidMount = function () {
                    this.props.onSizeChanged();
                };
                Popup.prototype.onAreaInternalResize = function () {
                    this.props.onSizeChanged();
                };
                Popup.prototype.onAreaExpand = function (areaId) {
                    this.setState(this.state.expandedArea == areaId ?
                        { expandedArea: null } :
                        { expandedArea: areaId });
                };
                return Popup;
            }(framework.Component));
            elements.Popup = Popup;
        })(elements = popup.elements || (popup.elements = {}));
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
var light_plugin;
(function (light_plugin) {
    var popup;
    (function (popup) {
        popup.createView = function (browserPlugin) { return new PopupView(browserPlugin); };
        popup.ELEMENT = framework.createElement;
        var PopupView = (function () {
            function PopupView(browserPlugin) {
                var _this = this;
                this.browserPlugin = browserPlugin;
                this.viewData = null;
                this.initialized = false;
                this.product = null;
                setTimeout(function () { return _this.showLoadingUiIfNotInitialized(); }, 200);
            }
            PopupView.prototype.onConnectedToProduct = function (product) {
                var _this = this;
                this.product = product;
                popup.initializeLocalization(this.product.localizationLoader, function () { return _this.onLocalizationReady(); });
            };
            PopupView.prototype.update = function (viewData) {
                this.updateData(viewData);
                if (this.initialized)
                    this.render();
            };
            PopupView.prototype.showLoadingUiIfNotInitialized = function () {
                if (this.initialized)
                    return;
                showLoadingUI();
                this.onSizeChanged();
            };
            PopupView.prototype.onLocalizationReady = function () {
                var _this = this;
                waitForWindowLoad(function () {
                    setTextReadingDirection();
                    applyCustomization();
                    _this.onLoad();
                });
            };
            PopupView.prototype.onLoad = function () {
                this.initialized = true;
                if (this.viewData)
                    this.render();
            };
            PopupView.prototype.updateData = function (viewData) {
                if (!this.viewData)
                    this.viewData = { settings: {}, areas: {} };
                if (viewData.settings)
                    this.viewData.settings = viewData.settings;
                for (var areaId in viewData.areas)
                    if (viewData.areas.hasOwnProperty(areaId))
                        this.viewData.areas[areaId] = viewData.areas[areaId];
            };
            PopupView.prototype.render = function () {
                var _this = this;
                framework.render(popup.ELEMENT(popup.elements.Popup, {
                    data: this.viewData.areas,
                    settings: this.viewData.settings,
                    popupWindow: this.browserPlugin.popupWindow,
                    controller: this.product.controller,
                    onSizeChanged: function () { return _this.onSizeChanged(); }
                }), document.getElementById('content'));
            };
            PopupView.prototype.onSizeChanged = function () {
                this.browserPlugin.popupWindow.resizeToFitContent();
            };
            return PopupView;
        }());
        function waitForWindowLoad(callback) {
            if (document.readyState === 'complete')
                callback();
            else
                window.onload = callback;
        }
        function setTextReadingDirection() {
            if (l10n('PopupLeftToRight') != '1')
                document.querySelector('html').className += "rtl";
        }
        function applyCustomization() {
            var css = l10n('PopupCustomizationCss');
            if (!css)
                return;
            var element = document.createElement('style');
            element.setAttribute('type', 'text/css');
            if ('styleSheet' in element)
                element.styleSheet.cssText = css;
            else
                element.textContent = css;
            document.querySelector('head').appendChild(element);
        }
        function showLoadingUI() {
            var element = document.querySelector('.popup-loader');
            element.style.display = 'block';
        }
    })(popup = light_plugin.popup || (light_plugin.popup = {}));
})(light_plugin || (light_plugin = {}));
