var nav,
    utils,
    appStoreURL,
    priceCategories,
    onSettingsUpdated;

/**
 *  Constructor
 */
(function constructor(args) {
    onSettingsUpdated = args.onSettingsUpdated;
    utils = require('/utils');
    priceCategories = [L('student'), L('employee')];
    
    if (OS_IOS) {
        nav = Ti.UI.iOS.createNavigationWindow({
            window: $.window
        });
        appStoreIdentifier = "722993370";
    } else {
        appStoreIdentifier = Ti.App.getId();

        var item = $.list.sections[0].items[0];
        item.selectedCategory.text = priceCategories[Ti.App.Properties.getInt("currentPersonID", 0)];
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
                
        $.list.sections[0].updateItemAt(0, item);
    }

    configureCells();
})(arguments[0] || {});

function configureCells() {
    var generalSection = $.list.getSections()[0];
    var selectedPriceCategory = generalSection.getItems()[0];
    var selectCanteenCell = generalSection.getItems()[1];
    
    selectedPriceCategory.tabbedBar.index = Ti.App.Properties.getInt("currentPersonID", 0);
    
    selectCanteenCell.properties.subtitle = Ti.App.Properties.getString("currentLocationName", Alloy.CFG.defaultCanteen.title);
    selectCanteenCell.properties.subtitleColor = "#888"; // 6.1.0+
    selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
    
    generalSection.updateItemAt(0, selectedPriceCategory);
    generalSection.updateItemAt(1, selectCanteenCell);
}

function changePreference(e) {
    Ti.App.Properties.setBool(e.section.getItemAt(e.itemIndex).properties.identifier, e.value);    
    onSettingsUpdated({
        action: "changePreference"
    });
}

function selectAction(e) {
    var item = e.section.getItemAt(e.itemIndex);
    var action = item.properties.action;
    
    if (!action) {
        return;
    }
    
    try {
        eval(action).call();
    } catch(e) {
        Ti.API.error(e);
    }
    
    OS_IOS && $.list.deselectItem(e.sectionIndex, e.itemIndex);
}

function selectCanteen(e) {
    Alloy.createController("/settings/selectCanteen", {
        selectedCanteen: function(e) {
            var generalSection = $.list.getSections()[0];
            var selectCanteenCell = generalSection.getItems()[0];
            
            selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
            selectCanteenCell.properties.subtitle = e.title;
            generalSection.updateItemAt(0, selectCanteenCell);   
            
            onSettingsUpdated(e);         
        }
    }).open();
}

function rateApp() {
    if (OS_IOS) {
        showProductDialog();
    } else {
        Ti.Platform.openURL("https://play.google.com/store/apps/details?id=" + appStoreIdentifier + "&reviewId=0");
    }
}

function showProductDialog() {
    if (utils.isEmulator()) {
        Ti.API.warn('The Ti.StoreView dialog is only supposed to work on device!');
        return;
    }
    
    var TiStoreView = require('com.dezinezync.storeview');
    var LoaderInstance = require("/loader");
    var loader = new LoaderInstance($.window);
     
    TiStoreView.addEventListener('loading', function() {
        loader.show();
    });
    
    TiStoreView.addEventListener('error', function(e) {
        Ti.API.error(e);
    });
    
    TiStoreView.addEventListener('willshow', function() {
        loader.hide();
    });
    
    TiStoreView.showProductDialog({
        'id': appStoreIdentifier
    });
}

function openAbout() {
    var aboutPage = Alloy.createController("/settings/webview", "about").getView();
    
    if (OS_IOS) {
        nav.openWindow(aboutPage);
    } else {
        aboutPage.open();
    }
}

function openContributors() {
    var contributorsPage = Alloy.createController("/settings/contributors").getView();

    if (OS_IOS) {
        nav.openWindow(contributorsPage);
    } else {
        contributorsPage.open();
    }
}

function reportError() {
    var mail = Ti.UI.createEmailDialog({
        subject : "Studentenfutter " + Ti.App.getVersion(),
        toRecipients : ["apps@hans-knoechel.de"]
    });
    mail.open();
}

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.window.close();
    }
}

function onOpen() {
    Ti.App.addEventListener("shortcut:canteenSelected", configureCells);
}

function onClose() {
    Ti.App.removeEventListener("shortcut:canteenSelected", configureCells);
}

exports.open = function() {
    if (OS_IOS) {
        nav.open({modal: true});
    } else {
        $.window.open();
    }
};

function togglePriceCategory(e) {
    Ti.App.Properties.setInt("currentPersonID", e.index);
    
    utils.selectionChanged();
    
    onSettingsUpdated({
        action: "changePreference"
    });
}

function togglePriceCategoryAndroid() {
    var options = Ti.UI.createOptionDialog({
        options: priceCategories.concat([L('cancel')]),
        cancel: 2
    });
    
    options.addEventListener('click', function(e) {
        if (e.cancel) {
            return;
        }
        
        togglePriceCategory(e);
        
        var item = $.list.sections[0].items[0];
        item.selectedCategory.text = priceCategories[e.index];
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
                
        $.list.sections[0].updateItemAt(0, item);
    });
    
    options.show();
}
