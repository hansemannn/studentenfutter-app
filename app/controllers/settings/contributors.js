import api from '/api';
import LoaderInstance from '/loader';

/**
*  Constructor
*/
(function constructor(args) {
	if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.window);
	}
}(arguments[0] || {}));

function populateContributors() {
	const loader = new LoaderInstance($.window);

	loader.show();

	api.getContrib(function (e) {
		let items = [];

		e.map(function (contributor) {
			items.push({
				properties: {
					itemId: contributor.id,
					username: contributor.login,
					accessoryType: OS_IOS ? Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE : null
				},
				avatar: {
					image: contributor.avatar_url
				},
				title: {
					text: contributor.login
				},
				subtitle: {
					text: contributor.contributions + ' ' + L('contributions')
				}
			});
		});

		$.section.setItems(items);
		loader.hide();
	});
}

function showContributorPage(e) {
	const item = e.section.getItemAt(e.itemIndex);
	const username = item.properties.username;
	const githubURL = 'https://github.com/' + username;

	if (OS_ANDROID) {
		Ti.Platform.openURL(githubURL);
	} else {
		const safariDialog = require('ti.safaridialog');

		if (!safariDialog.isSupported()) {
			Ti.Platform.openURL(githubURL);
		} else {
			safariDialog.open({
				url: githubURL,
				tintColor: Alloy.CFG.styles.tintColor,
				animted: true
			});
		}
	}
}
