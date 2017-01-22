var nav,
    locations,
    selectedCanteen;

/**
 *  Constructor
 */
(function constructor(args) {
    locations = require("/locations").getData();
    selectedCanteen = args.selectedCanteen;
    
    if (OS_IOS) {
        nav = Ti.UI.iOS.createNavigationWindow({
            window: $.window
        });
    } else if (OS_ANDROID) {
        Alloy.Globals.setAndroidBackButton($.window);
    }
})(arguments[0] || {});

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.window.close();
    }
}

function populateLocations() {
	var items = [];
    var currentCanteenName = Ti.App.Properties.getString("currentLocationName", Alloy.CFG.defaultCanteen.title);

	for (var i = 0; i < locations.length; i++) {
        var attrs = {
			properties: {
                itemId: locations[i].id,
				title: locations[i].title,
                accessoryType: Ti.UI[((currentCanteenName == locations[i].title) ? "LIST_ACCESSORY_TYPE_CHECKMARK" : "LIST_ACCESSORY_TYPE_DISCLOSURE")]
			}
		};
        
        if (OS_ANDROID) {
            attrs = {
                properties: _.extend(attrs.properties, {
                    left: 15,
            	    height: 43,
            	    color: "#000",
            	    font: {
                    	fontSize: 15
                    }
                })
            };
        }
        
        items.push(attrs);
	}
	
	$.section.setItems(items);
}

function selectLocation(e) {
	var item = e.section.getItemAt(e.itemIndex);
		
	Ti.App.Properties.setString("currentLocationName", item.properties.title);
	Ti.App.Properties.setInt("currentLocationID", e.itemId);

    selectedCanteen && selectedCanteen({
        action: "selectCanteen",
        title: item.properties.title,
        id: e.itemId
    });
	close();
}

exports.open = function() {
    if (OS_IOS) {
        nav.open({modal: true});
    } else {
        $.window.open();
    }
};
