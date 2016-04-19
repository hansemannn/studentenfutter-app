var nav,
    loader,
    LoaderInstance,
    dateutils;

/**
 *  Constructor
 */
(function constructor(args) {
    initializeLoader();
    initializeDate();
    
    $.tabs.onGroupSelected = setUI;
    
    if (OS_IOS) {
        nav = createNavigationWindow();
    }
})(arguments[0] || {});

function initializeLoader() {
    LoaderInstance = require("loader");
    loader = new LoaderInstance($.window);
}

function initializeDate() {
    dateutils = require("dateutils");
    $.window.setTitle("Heute, " + dateutils.getToday());
}

function createNavigationWindow() {
    return Ti.UI.iOS.createNavigationWindow({
        window: $.window
    });
}

function toggleNextDay() {
    $.window.setTitle(dateutils.increment());
}

function togglePreviousDay() {
    $.window.setTitle(dateutils.decrement());
}

function handleListItemClick(e) {
    var item = e.itemId;
    openDetails(item);
}

function openDetails() {
    
}

function fetchData() {
    loader.show();
    setUI();
}

function setUI() {
    if (OS_IOS) {
        $.refresh.endRefreshing();
    }
    
    loader.hide();
}

function open() {
    if (OS_IOS) {
        nav.open();
    } else {
        $.window.open();
    }
}

exports.open = open;