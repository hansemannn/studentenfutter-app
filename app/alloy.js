Ti.UI.setBackgroundColor("#fff");

Alloy.Collections.lunch = Alloy.createCollection("lunch");
Alloy.Models.cart = Alloy.createModel("cart"); 
Alloy.Globals.Map = require("ti.map");
Alloy.Globals.displayWidth = Ti.Platform.getDisplayCaps().getPlatformWidth();
Alloy.Globals.isGooglePlayServicesAvailable = OS_IOS || Alloy.Globals.Map.isGooglePlayServicesAvailable() === true;
Alloy.Globals.setAndroidBackButton = function(_window) {
	_window.addEventListener('open', function() {
		var ABH = require('actionbar').actionBarHelper;
		var actionBarHelper = new ABH(_window);

		if(_window.title && _window.title.length > 0)
			actionBarHelper.setTitle(_window.title);

		actionBarHelper.setUpAction(function() {
			_window.close();
		});
	});
};
