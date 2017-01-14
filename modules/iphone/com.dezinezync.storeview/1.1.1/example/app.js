var TiStoreView = require('com.dezinezync.storeview');
var appID = "284910350";

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

var button = Ti.UI.createButton({
	title: "Open App in AppStore",
    top: 100
});

var loader = Ti.UI.createActivityIndicator({
    style: Ti.UI.ActivityIndicatorStyle.DARK,
    bottom: 100,
});

TiStoreView.addEventListener('loading', function(e) {
    loader.show();
	console.log(e);
});

TiStoreView.addEventListener('willshow', function(e) {
    loader.hide();
	console.log(e);
});

TiStoreView.addEventListener('willdimiss', function(e) {
	console.log(e);
});

TiStoreView.addEventListener('error', function(e) {
	console.log(e);
});

button.addEventListener("click", function() {
	
	Ti.API.info("Showing store for AppID: " + appID);

	TiStoreView.showProductDialog({
        'id': appID // SKStoreProductParameterITunesItemIdentifier
    });
});

win.add(button);
win.add(loader);
win.open();
