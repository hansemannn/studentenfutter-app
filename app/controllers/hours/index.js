import Map from 'ti.map';

let location,
	firstOpenDone;

/**
 *  Constructor
 */
(function constructor() {
	location = require('locations').getCurrentLocation();
	firstOpenDone = false;

	if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.index);
	}

	setMap();
	setUI();
}(arguments[0] || {}));

function setMap() {
	const pin = Map.createAnnotation({
		latitude: location.location.lat,
		longitude: location.location.lon,
		title: location.title,
		subtitle: location.location.address
	});
	$.map.addAnnotation(pin);

	$.map.setRegion({
		latitude: location.location.lat,
		longitude: location.location.lon,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05
	});
}

function askForRoute() {
	// Android has route buttons inside the map (on tap)
	if (OS_ANDROID) {
		return;
	}

	const dia = Ti.UI.createAlertDialog({
		title: L('show_route'),
		message: L('show_route_msg'),
		buttonNames: [ L('cancel'), L('show') ],
		preferred: 1,
		cancel: 0
	});

	dia.addEventListener('click', (e) => {
		if (e.index === 1) {
			const prefix = (OS_ANDROID) ? 'http://maps.google.com/?' : 'maps:';
			Ti.Platform.openURL(prefix + 'f=d&hl=en&geocode=&saddr=&sll=&daddr=' +  encodeURIComponent(location.location.address));
		}
	});

	dia.show();
}

function setUI() {
	const openings = location.openings;
	let sections = [];

	for (let i = 0; i < openings.length; i++) {
		const opening = openings[i];

		let attrs = {
			properties: {
				height: 43,
				title: opening.time
			}
		};

		if (OS_ANDROID) {
			attrs = {
				properties: Object.assign(attrs.properties, {
					left: 15,
					color: '#000',
					font: {
						fontSize: 15
					}
				})
			};
		}

		const section = Ti.UI.createListSection({
			headerTitle: opening.date,
			items: [ attrs ]
		});
		sections.push(section);
	}

	$.list.sections = sections;
}

function selectAnnotation() {
	if (firstOpenDone) {
		return;
	}

	firstOpenDone = true;

	if (OS_IOS) {
		$.map.visibleMapRect = {
			animated: true,
			padding: {
				top: 50
			}
		};
	}

	$.map.selectAnnotation($.map.annotations[0]);
}
