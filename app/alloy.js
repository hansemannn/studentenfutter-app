import ActionBarHelper from 'actionbar';
import Map from 'ti.map';

const isiPhoneX = (Ti.Platform.displayCaps.platformWidth === 375 && Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.logicalDensityFactor === 3);

let PlayServices = null;

if (OS_ANDROID) {
	PlayServices = require('ti.playservices');
}

Ti.UI.setBackgroundColor('#fff');

Alloy.Globals.footerBarHeight = (OS_IOS && Ti.Platform.displayCaps.platformHeight === 812) ? 64 : 44;
Alloy.Collections.lunch = Alloy.createCollection('lunch');
Alloy.Models.cart = Alloy.createModel('cart'); 
Alloy.Globals.displayWidth = Ti.Platform.getDisplayCaps().getPlatformWidth();
Alloy.Globals.isGooglePlayServicesAvailable = PlayServices && PlayServices.isGooglePlayServicesAvailable();
Alloy.Globals.footerHeight = isiPhoneX ? 64 : 44;

Alloy.Globals.setAndroidBackButton = function(_window) {
	if (!OS_ANDROID) { return; }

	_window.addEventListener('open', () => {
		const actionBarHelper = new ActionBarHelper(_window);

		if (_window.title && _window.title.length > 0) {
			actionBarHelper.setTitle(_window.title);
		}

		actionBarHelper.setUpAction(() => {
			_window.close();
		});
	});
};
