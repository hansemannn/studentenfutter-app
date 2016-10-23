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
        appStoreURL = "https://userpub.itunes.apple.com/WebObjects/MZUserPublishing.woa/wa/addUserReview?id=722993370";
    } else {
        appStoreURL = "https://play.google.com/store/apps/details?id=de.ncn.mensaapp&reviewId=0";
    }

    configureCells();
})(arguments[0] || {});

function configureCells() {
    var generalSection = $.list.getSections()[0];
    var showAdditivesCell = generalSection.getItems()[0];
    var showRatingsCell = generalSection.getItems()[1];
    var selectCanteenCell = generalSection.getItems()[2];
    
    showAdditivesCell.toggle.value = Ti.App.Properties.getBool("showAdditives", true);
    showRatingsCell.toggle.value = Ti.App.Properties.getBool("showRatings", true);
    selectCanteenCell.properties.subtitle = Ti.App.Properties.getString("currentLocationName", Alloy.CFG.defaultCanteen.title);
    selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
    selectCanteenCell.properties.subtitleColor = "#888";
    
    generalSection.updateItemAt(0, showAdditivesCell);
    generalSection.updateItemAt(1, showRatingsCell);
    generalSection.updateItemAt(2, selectCanteenCell);
}

function changePreference(e) {
    Ti.App.Properties.setBool(e.section.getItemAt(e.itemIndex).properties.identifier, e.value);    
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
    Alloy.createController("settings/selectCanteen", {
        selectedCanteen: function(e) {
            var generalSection = $.list.getSections()[0];
            var selectCanteenCell = generalSection.getItems()[2];
            
            selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
            selectCanteenCell.properties.subtitle = e.title;
            generalSection.updateItemAt(2, selectCanteenCell);   
            
            onSettingsUpdated(e);         
        }
    }).open();
}

function rateApp() {
    Ti.Platform.openURL(appStoreURL);
}

function openAbout() {
    Alloy.createController("settings/about").open();
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

function onClose() {
    
}

exports.open = function() {
    if (OS_IOS) {
        nav.open({modal: true});
    } else {
        $.window.open();
    }
};
