var nav,
    appStoreURL,
    onSettingsUpdated;

/**
 *  Constructor
 */
(function constructor(args) {
    onSettingsUpdated = args.onSettingsUpdated;
    if (OS_IOS) {
        nav = Ti.UI.iOS.createNavigationWindow({
            window: $.window
        });
        appStoreIdentifier = "722993370";
    } else {
        appStoreIdentifier = "de.ncn.mensaapp";
    }

    configureCells();
})(arguments[0] || {});

function configureCells() {
    var generalSection = $.list.getSections()[0];
    // var showAdditivesCell = generalSection.getItems()[0];
    // var showRatingsCell = generalSection.getItems()[1];
    var selectCanteenCell = generalSection.getItems()[0];
    
    // showAdditivesCell.toggle.value = Ti.App.Properties.getBool("showAdditives", true);
    // showRatingsCell.toggle.value = Ti.App.Properties.getBool("showRatings", true);
    selectCanteenCell.properties.subtitle = Ti.App.Properties.getString("currentLocationName", Alloy.CFG.defaultCanteen.title);
    selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
    selectCanteenCell.properties.subtitleColor = "#888";
    
    // generalSection.updateItemAt(0, showAdditivesCell);
    // generalSection.updateItemAt(1, showRatingsCell);
    generalSection.updateItemAt(0, selectCanteenCell);
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
    
    $.list.deselectItem(e.sectionIndex, e.itemIndex);
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
    if (Ti.App.getDeployType() === 'development') {
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
    nav.openWindow(Alloy.createController("/settings/webview", "about").getView());
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
