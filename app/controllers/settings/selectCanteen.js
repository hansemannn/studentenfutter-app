import Locations from 'locations';

let nav;
let selectedCanteen;
let locations;

/**
 *  Constructor
 */
(function constructor(args) {
	locations = Locations.getData();
	selectedCanteen = args.selectedCanteen;

	if (OS_IOS) {
		nav = Ti.UI.createNavigationWindow({
			window: $.window
		});
	} else if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.window);
	}
}(arguments[0] || {}));

function close() {
	if (OS_IOS) {
		nav.close();
	} else {
		$.window.close();
	}
}

function populateLocations() {
	let items = [];
	const currentCanteenName = Ti.App.Properties.getString('currentLocationName', Alloy.CFG.defaultCanteen.title);

	for (let i = 0; i < locations.length; i++) {
		let attrs = {
			properties: {
				itemId: locations[i].id,
				title: locations[i].title
			}
		};

		if (currentCanteenName === locations[i].title) {
			attrs.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
		} else if (OS_IOS) {
			attrs.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE; // No custom disclosure on Android
		}

		if (OS_ANDROID) {
			attrs = {
				properties: Object.assign(attrs.properties, {
					left: 15,
					height: 43,
					color: '#000',
					font: {
						fontSize: 15
					}
				})
			};
		}

		items.push(attrs);
	}

	$.section.items = items;
}

function selectLocation(e) {
	const item = e.section.getItemAt(e.itemIndex);

	Ti.App.Properties.setString('currentLocationName', item.properties.title);
	Ti.App.Properties.setInt('currentLocationID', e.itemId);

	selectedCanteen && selectedCanteen({
		action: 'selectCanteen',
		title: item.properties.title,
		id: e.itemId
	});
	close();
}

exports.open = function () {
	if (OS_IOS) {
		nav.open({
			modal: true,
			modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
		});
	} else {
		$.window.open();
	}
};
