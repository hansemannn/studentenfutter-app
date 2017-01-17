Ti.UI.setBackgroundColor("#fff");

Alloy.Collections.lunch = Alloy.createCollection("lunch");
Alloy.Models.cart = Alloy.createModel("cart"); 
Alloy.Globals.Map = require("ti.map");
Alloy.Globals.displayWidth = Ti.Platform.getDisplayCaps().getPlatformWidth();
Alloy.Globals.isGooglePlayServicesAvailable = OS_IOS || Alloy.Globals.Map.isGooglePlayServicesAvailable() === true;
