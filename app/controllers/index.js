/**
 *  Constructor
 */
(function constructor(args) {        
    OS_IOS && Ti.App.iOS.addEventListener("shortcutitemclick", function(e) {
        switch (e.itemtype) {
            case "SelectCanteen": openCanteenSelector();
            break;
        }
    });
    
    OS_IOS && initializeWatchSession();
    
    $.index.open();
})(arguments[0] || {});

function initializeWatchSession() {
    var available = (Ti.WatchSession.isSupported && Ti.WatchSession.isPaired && Ti.WatchSession.isReachable);
    
    if (!available) {
        return;
    }
    
    Ti.WatchSession.activateSession();
    
    Ti.WatchSession.addEventListener('receivemessage', function(e) {
        alert('Message!!');
        Ti.WatchSession.sendMessage({
            message: {
                'test': 'hi'
            },
            reply: function(e) {
                alert('reply');
            }
        })
    })
}

function openCanteenSelector() {
    Alloy.createController("/settings/selectCanteen", {
        selectedCanteen: function(e) {
            Ti.App.fireEvent("shortcut:canteenSelected", e);              
        }
    }).open();
}
