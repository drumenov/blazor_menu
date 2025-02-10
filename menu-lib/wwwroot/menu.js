var isRtl;
const actionAttributeSelector = "menu_action";
const openedClassName = "opened";
const charactersToEscape = /[^\w]/g;
const replacedEscapedCharactersWith = "_";
const idAttribute = "id";

document.addEventListener("DOMContentLoaded", function addStyles() {
    isRtl = document.querySelector("body").dir == "rtl";
    Array.from(document.querySelector("nav").childNodes)
        .filter(getElementByType("UL"))
        .forEach(handleMenuItems(false, true));
}, { once: true });

window.addEventListener("resize", function repositionMenus() {
    Array.from(document.querySelector("nav").childNodes)
        .filter(getElementByType("UL"))
        .forEach(handleMenuItems(false, false));
});

function getElementByType(type) {
    return element => element.tagName == type;
}

function handleMenuItems(openMenuOnTheSide, attachEventListener) {
    return ulElement => Array.from(ulElement.childNodes).filter(getElementByType("LI")).map(attachClickEventToMenuLabel(openMenuOnTheSide, attachEventListener));
}

function attachClickEventToMenuLabel(openMenuOnTheSide, attachEventListener) {
    return liElement => {
        liElement.addEventListener("mouseleave", event => (closeOpenedChildren([event.target])));
        liElement.style.position = "relative";
        var children = Array.from(liElement.childNodes);
        var menuBtn = children.filter(getElementByType("BUTTON"))[0];
        var submenu = children.filter(getElementByType("UL"))[0];
        if (submenu) {
            if (attachEventListener) {
                menuBtn.addEventListener("mouseenter", function openDiv() {
                    if (!submenu.classList.contains(openedClassName)) {
                        closeAnyOpenedMenu(submenu.parentElement);
                        submenu.classList.add(openedClassName);
                    }
                });
                addArrow(menuBtn, openMenuOnTheSide);
            }
            positionSubmenu(liElement, submenu, openMenuOnTheSide);
            handleMenuItems(true, attachEventListener)(submenu);
        } else {
            menuBtn.setAttribute(`${idAttribute}`,`${actionAttributeSelector}_${menuBtn.textContent.replace(charactersToEscape, replacedEscapedCharactersWith)}`);
        }
    };
}

function addArrow(menuBtn, openMenuOnTheSide) {
    if (openMenuOnTheSide) {
        if (isRtl) {
            menuBtn.classList.add("arrow-left");
        } else {
            menuBtn.classList.add("arrow-right");
        }
    } else {
        menuBtn.classList.add("arrow-down");
    }
}

function closeAnyOpenedMenu(submenuParent) {
    var menuContainer = submenuParent.parentElement;
    if (elementiIsOfType(menuContainer, "NAV")) {
        return;
    } else {
        var childrenToVisit = Array.from(menuContainer.childNodes).filter(excludeChild(submenuParent));
        closeOpenedChildren(childrenToVisit);
    }
}

function excludeChild(childElement) {
    return element => childElement.tagName == element.tagName && childElement != element;
}

function elementiIsOfType(element, type) {
    return element.tagName == type;
}

var closeOpenedChildren = function closeMenu(children) {
    var childrenToCheck = children
        .filter(getOpenedChildren())
        .map(li => Array.from(li.childNodes).filter(getElementByType("UL"))[0])
        .filter(x => x != null);

    for (let child of childrenToCheck) {
        closeMenu(Array.from(child.childNodes));
        child.classList.remove(openedClassName);
        return true;
    }
    return false;
}

function getOpenedChildren() {
    return element => elementiIsOfType(element, "LI") && Array.from(element.childNodes)
                                                            .filter(getElementByType("UL"))[0]
                                                            ?.classList.contains(openedClassName);
}

function positionSubmenu(liElement, submenu, openMenuOnTheSide) {
    if (openMenuOnTheSide) {
        submenu.style.top = "0px";
        if (isRtl) {
            submenu.style.right = `${liElement.getBoundingClientRect().width}px`;
        } else {
            submenu.style.left = `${liElement.getBoundingClientRect().width}px`;
        }
    } else {
        submenu.style.top = `${liElement.getBoundingClientRect().height}px`;
    }
}

var generateSubMenu = function gunurateMenu(liElement) {
    var subMenuItems = Array.from(liElement.childNodes).filter(getElementByType("DIV"));
    if (subMenuItems) {
        liElement.style.position = "relative";
        subMenuItems.forEach(function positionSubMenu(divElement) {
            divElement.style.position = "absolute";
            divElement.style.left = `${liElement.getBoundingClientRect().right}px`;
            divElement.style.top = "0px";
        })
    }
}

function attachMenuAction(menuBtnText, callback) {
    const escapedName = menuBtnText.replace(charactersToEscape, replacedEscapedCharactersWith);
    var btn = document.getElementById(`${actionAttributeSelector}_${escapedName}`);
    btn.addEventListener("click", callback);
}