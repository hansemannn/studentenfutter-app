/**
 *  Constructor
 */
(function constructor(args) {        
    OS_IOS && Ti.App.iOS.addEventListener('shortcutitemclick', (e) => {
        switch (e.itemtype) {
            case 'SelectCanteen': openCanteenSelector();
            break;
        }
    });
    
    $.index.open();
})(arguments[0] || {});

function openCanteenSelector() {
    Alloy.createController('/settings/selectCanteen', {
        selectedCanteen: (e) => {
            Ti.App.fireEvent('shortcut:canteenSelected', e);              
        }
    }).open();
}
