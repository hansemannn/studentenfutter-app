var data = [{
	title : "Mensa Schlossgarten",
	id : 0,
	openings : [{
		date : L("monday") + " - " + L("friday"),
		time : "11:45 - 14:15 Uhr"
	}, {
		date : L("saturday"),
		time : "12:00 - 13:00 Uhr"
	}],
	location : {
		lat : 52.270128,
		lon : 8.045089,
		address: "Ritterstraße 10, Osnabrück"
	}
}, {
	title : "Mensa Westerberg",
	id : 1,
	openings : [{
		date : L("monday") + " - " + L("friday"),
		time : "11:30 - 14:15 Uhr"
	}],
	location : {
		lat : 52.2853,
		lon : 8.0240,
		address: "Barbarastraße 20, Osnabrück"
	}
}, {
	title : "Mensa Haste",
	id : 2,
	openings : [{
		date : L("monday") + " - " + L("friday"),
		time : "12:00 - 14:00 Uhr"
	}],
	location : {
		lat : 52.3027,
		lon : 8.0363,
		address: "Oldenburger Landstraße, Osnabrück"
	}
}, {
	title : "Mensa Vechta",
	id : 3,
	openings : [{
		date : L("monday") + " - " + L("thursday"),
		time : "11:30 - 14:00 Uhr"
	}, {
		date : L("friday"),
		time : "11:30 - 13:00 Uhr"
	}, {
		date : L("saturday"),
		time : "12:00 - 13:00 Uhr"
	}],
	location : {
		lat : 52.7205,
		lon : 8.2948,
		address: "Universitätsstraße 1, Vechta"
	}
}, {
	title : "Mensa Lingen",
	id : 4,
	openings : [{
		date : L("monday") + " - " + L("friday"),
		time : "09:30 - 16:00 Uhr"
	}],
	location : {
		lat : 52.5194,
		lon : 7.3226,
		address: "Kaiserstraße 10e, Lingen"
	}
}, {
	title : "Bistro Caprivi",
	id : 5,
	openings : [{
		date : L("monday") + " - " + L("thursday"),
		time : "07:45 - 16:20 Uhr"
	},{
		date : L("friday"),
		time : "07:45 - 13:45 Uhr"
	}],
	location : {
		lat : 52.2853,
		lon : 8.0240,
		address: "Caprivistraße 30a, Osnabrück"
	}
}, {
	title : "Cafeteria Schlossgarten",
	id : 6,
	openings : [{
		date : L("monday") + " - " + L("thursday"),
		time : "09:00 - 15:00 Uhr"
	},{
		date : L("friday"),
		time : "09:00 - 14:35 Uhr"
	}],
	location : {
		lat : 52.2853,
		lon : 8.0240,
		address: "Ritterstraße 10, Osnabrück"
	}
}, {
	title : "Cafeteria Westerberg",
	id : 7,
	openings : [{
		date : L("monday") + " - " + L("thursday"),
		time : "09:00 - 21:00 Uhr"
	},{
		date : L("friday"),
		time : "09:00 - 16:30 Uhr"
	}],
	location : {
		lat : 52.2853,
		lon : 8.0240,
		address: "Barbarastraße 20, Osnabrück"
	}
}];

module.exports = {
	getData : function() {
		return data;
	},
	getCurrentLocation : function() {
		for (var i = 0; i < data.length; i++) {
			if (data[i].id == Ti.App.Properties.getInt("currentLocationID",  Alloy.CFG.defaultCanteen.id)) {
				return data[i];
			}
		};
		
		Ti.API.error("LOGIC ERROR: NO CURRENT LOCATION!");
		
		return null;
	}
};
