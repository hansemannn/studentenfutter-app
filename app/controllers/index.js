/**
 *  Constructor
 */
(function constructor(args) {        
    Ti.App.iOS.addEventListener("shortcutitemclick", function(e) {
        switch (e.itemtype) {
            case "SelectCanteen": openCanteenSelector();
            break;
        }
    });
    
    $.index.open();
})(arguments[0] || {});

function openCanteenSelector() {
    Alloy.createController("settings/selectCanteen", {
        selectedCanteen: function(e) {
            Ti.App.fireEvent("shortcut:canteenSelected", e);              
        }
    }).open();
}
