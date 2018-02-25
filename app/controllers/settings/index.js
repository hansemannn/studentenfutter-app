import utils from '/utils';

const priceCategories = [L('student'), L('employee')];

let nav;
let onSettingsUpdated;
let appStoreIdentifier;

/**
 *  Constructor
 */
(function constructor(args) {
    onSettingsUpdated = args.onSettingsUpdated;
    
    if (OS_IOS) {
        nav = Ti.UI.iOS.createNavigationWindow({
            window: $.window
        });
        appStoreIdentifier = '722993370';
    } else {
        appStoreIdentifier = Ti.App.getId();

        let item = $.list.sections[0].items[0];
        item.selectedCategory.text = priceCategories[Ti.App.Properties.getInt('currentPersonID', 0)];
        
        if (OS_IOS) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        }
                
        $.list.sections[0].updateItemAt(0, item);
        OS_ANDROID && Alloy.Globals.setAndroidBackButton($.window);
    }

    configureCells();
})(arguments[0] || {});

function configureCells() {
    const generalSection = $.list.getSections()[0];
    const selectedPriceCategory = generalSection.getItems()[0];
    const selectCanteenCell = generalSection.getItems()[1];
    
    selectedPriceCategory.tabbedBar.index = Ti.App.Properties.getInt('currentPersonID', 0);
    
    selectCanteenCell.properties.subtitle = Ti.App.Properties.getString('currentLocationName', Alloy.CFG.defaultCanteen.title);
    selectCanteenCell.properties.subtitleColor = '#888'; // 6.1.0+
    selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
    
    generalSection.updateItemAt(0, selectedPriceCategory);
    generalSection.updateItemAt(1, selectCanteenCell);
}

function changePreference(e) {
    Ti.App.Properties.setBool(e.section.getItemAt(e.itemIndex).properties.identifier, e.value);    
    onSettingsUpdated({
        action: 'changePreference'
    });
}

function selectAction(e) {
    const item = e.section.getItemAt(e.itemIndex);
    const action = item.properties.action;
    
    if (!action || (OS_IOS && action === 'togglePriceCategoryAndroid')) {
        return;
    }
    
    switch (action) {
      case 'selectCanteen': 
      selectCanteen();
      break;
      case 'openHours': 
      openHours();
      break;
      case 'rateApp': 
      rateApp();
      break;
      case 'openContributors': 
      openContributors();
      break;
      case 'reportError': 
      reportError();
      break;
      default:
      console.log(action);
    }
    
    OS_IOS && $.list.deselectItem(e.sectionIndex, e.itemIndex);
}

function selectCanteen(e) {
    Alloy.createController('/settings/selectCanteen', {
        selectedCanteen: (e) => {
            const generalSection = $.list.getSections()[0];
            const selectCanteenCell = generalSection.getItems()[1];
            
            selectCanteenCell.template = Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE;
            selectCanteenCell.properties.subtitle = e.title;
            generalSection.updateItemAt(1, selectCanteenCell);   
            
            onSettingsUpdated(e);         
        }
    }).open();
}

function openHours() {
    const hours = Alloy.createController('/hours/index').getView();
    
    if (OS_IOS) {
        nav.openWindow(hours);
    } else {
        hours.open();
    }
}

function rateApp() {
    if (OS_IOS) {
        showProductDialog();
    } else {
        Ti.Platform.openURL('https://play.google.com/store/apps/details?id=' + appStoreIdentifier + '&reviewId=0');
    }
}

function showProductDialog() {
    const TiStoreView = require('com.dezinezync.storeview');
    const TiReviewDialog = require('ti.reviewdialog');
    
    if (!TiReviewDialog.isSupported() && utils.isEmulator()) {
        Ti.API.warn('The Ti.StoreView dialog is only supposed to work on device!');
        return;
    }
    
    if (!TiReviewDialog.isSupported()) {
        const TiStoreView = require('com.dezinezync.storeview');
        const LoaderInstance = require('/loader');
        const loader = new LoaderInstance($.window);
         
        TiStoreView.addEventListener('loading', () => {
            loader.show();
        });
        
        TiStoreView.addEventListener('error', (e) => {
            Ti.API.error(e);
        });
        
        TiStoreView.addEventListener('willshow', () => {
            loader.hide();
        });
        
        TiStoreView.showProductDialog({
            id: appStoreIdentifier
        });
    } else {
        TiReviewDialog.requestReview();
    }
}

function openAbout() {
    const aboutPage = Alloy.createController('/settings/webview', 'about').getView();
    
    if (OS_IOS) {
        nav.openWindow(aboutPage);
    } else {
        aboutPage.open();
    }
}

function openContributors() {
    const contributorsPage = Alloy.createController('/settings/contributors').getView();

    if (OS_IOS) {
        nav.openWindow(contributorsPage);
    } else {
        contributorsPage.open();
    }
}

function reportError() {
    const mail = Ti.UI.createEmailDialog({
        subject : 'Studentenfutter ' + Ti.App.getVersion(),
        toRecipients : ['apps@hans-knoechel.de']
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
    Ti.App.addEventListener('shortcut:canteenSelected', configureCells);
}

function onClose() {
    Ti.App.removeEventListener('shortcut:canteenSelected', configureCells);
}

exports.open = function() {
    if (OS_IOS) {
      nav.open({
        modal: true, 
        modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
      });
    } else {
        $.window.open();
    }
};

function togglePriceCategory(e) {
    Ti.App.Properties.setInt('currentPersonID', e.index);
    
    utils.selectionChanged();
    
    onSettingsUpdated({
        action: 'changePreference'
    });
}

function togglePriceCategoryAndroid() {
    const options = Ti.UI.createOptionDialog({
        options: priceCategories.concat([L('cancel')]),
        cancel: 2
    });
    
    options.addEventListener('click', (e) => {
        if (e.cancel) {
            return;
        }
        
        togglePriceCategory(e);
        
        let item = $.list.sections[0].items[0];
        item.selectedCategory.text = priceCategories[e.index];

        if (OS_IOS) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE;
        }
                
        $.list.sections[0].updateItemAt(0, item);
    });
    
    options.show();
}
