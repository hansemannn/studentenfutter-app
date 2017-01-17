var nav,
	location;

/**
 *  Constructor
 */
(function constructor(args) {
	location = require("/locations").getCurrentLocation();

	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.index
		});
	}
	
	setMap();
	setUI();
})(arguments[0] || {});

function setMap() {
	if (!Alloy.Globals.isGooglePlayServicesAvailable) {
		Ti.API.warn('Google Maps is not configured correctly. Please set your API key in the tiapp.xml, clean and try again!');
		return;
	}
	
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
		
		var attrs = {
			properties: {
				height: 43,
				title: opening.time
			}
		};
		
		if (OS_ANDROID) {
			attrs = {
				properties: _.extend(attrs.properties, {
					left: 15,
					color: "#000",
					font: {
						fontSize: 15
					}
				})
			};
		}

		var section = Ti.UI.createListSection({
			headerTitle: opening.date,
			items: [attrs]
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
	if (!Alloy.Globals.isGooglePlayServicesAvailable) {
		return;
	}
	
	$.map.selectAnnotation($.map.annotations[0]);
}
