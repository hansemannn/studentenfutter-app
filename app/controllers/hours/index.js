var nav,
	location;

/**
 *  Constructor
 */
(function constructor(args) {
	location = require("locations").getCurrentLocation();

	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.index
		});
	}
	
	setMap();
	setUI();
})(arguments[0] || {});

function setMap() {
	var pin = Alloy.Globals.Map.createAnnotation({
		latitude: location.location.lat,
		longitude: location.location.lon,
		title: location.title,
		subtitle: location.location.address
	});
	$.map.addAnnotation(pin);
	
	$.map.setRegion({
		latitude: location.location.lat,
		longitude: location.location.lon,
		latitudeDelta : 0.05,
		longitudeDelta : 0.05
	});
}

function askForRoute() {
	var dia = Ti.UI.createAlertDialog({
		title: L("show_route"),
		message: L("show_route_msg"),
		buttonNames: [L("cancel"), L("show")],
		preferred: 1,
		cancel: 0
	});

	dia.addEventListener("click", function(e) {
		if(e.index == 1) {
			var prefix = (OS_ANDROID) ? "http://maps.google.com/?" : "maps:";
			Ti.Platform.openURL(prefix + "f=d&hl=en&geocode=&saddr=&sll=&daddr=" +  encodeURIComponent(location.location.address))
		}
	});

	dia.show();
}

function setUI() {
	var openings = location.openings;
	var sections = [];
	
	for (var i = 0; i < openings.length;i++) {
		var opening = openings[i];
		var items = [];

		var section = Ti.UI.createListSection({
			headerTitle: opening.date,
			items: [{
				properties: {
					height: 43,
					title: opening.time
				}
			}]
		});
		sections.push(section);
	}
	
	$.list.setSections(sections);
}

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.index.close();
    }
}

exports.open = function() {
    if (OS_IOS) {
        nav.open({modal: true});
    } else {
        $.index.open();
    }
};

function selectAnnotation(e) {
	$.map.selectAnnotation($.map.annotations[0]);
}
