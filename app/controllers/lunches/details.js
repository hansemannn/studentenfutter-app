var nav,
	product,
	utils,
	ListAction;

/**
 *  Constructor
 */
(function constructor(_product) {
	product = _product;
	utils = require("/utils");
	
	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.details
		});
	}
	
	// Mapped to the itemId's of the items
	ListAction = {
		PerformRating: 'rating',
		ShowAdditives: 'additives'		
	};
	
	setUI();
})(arguments[0] || {});

function setUI() {
	$.title.setText(product.name);
	
	setImages();
	setRating();
}

function setImages() {
	var images = product.images || null;
	var views = [];
		
	if (!images || images.length == 0) {
		return;
	}
	
	$.placeholder.hide();
	
	// TODO: Move to Alloy-based generation
		
	_.each(images, function(image) {
		var view = Ti.UI.createView({
			left: 15,
			top: 10,
			height: 165,
			width: 165,
			borderRadius: 0,
			viewShadowRadius: 2,
			viewShadowColor: "#A6444444", // 65 %
			viewShadowOffset: {x: 0, y: 2}
		});
		view.add(Ti.UI.createImageView({
			defaultImage: "/images/noImage.png",
			borderRadius: 0,
			image: image,
		}));
		
		$.images.add(view);
	});
	 	
	var label = Ti.UI.createLabel({
		text: "+ ",
		color: "#fff",
		opacity: 0.3,
		top: 40,
		left: 10,
		font: {
			fontSize: 80,
			fontWeight: "bold"
		}
	});
	
	label.addEventListener("click", showCamera);	
		
	$.images.add(label);	
}

function setRating() {
	var section = $.list.sections[0];
	var ratingCell = section.items[0];
	var additivesCell = section.items[1];
	var hasAdditives = product.additives && product.additives.length;

	ratingCell.rating.image = utils.formattedStars(product.rating);
	additivesCell.additives.text = hasAdditives ? product.additives.length : "0";
	
	if (!hasAdditives) {
		additivesCell.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		additivesCell.additivesBackground.right = 15;
	}
	
	section.updateItemAt(0, ratingCell);
	section.updateItemAt(1, additivesCell);
}

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.details.close();
    }
}

exports.open = function(animated) {
    if (OS_IOS) {
        nav.open({modal: animated});
    } else {
        $.details.open();
    }
};

function showCamera(e) {
	
}

function handleAction(e) {
	switch (e.itemId) {
		case ListAction.PerformRating:
			performRating();
		break;
		
		case ListAction.ShowAdditives:
			showAdditives();
		break;
	}
	
	$.list.deselectItem(e.sectionIndex, e.itemIndex);
}

function performRating() {
	alert('TODO: Create own modal dialog to rate stars! 🚀');
}

function showAdditives() {
	var usedAdditives = product.additives || [];
	
	try {
		var additives = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/additives.json').read());
		var result = [];
		
		_.map(additives, function(additive) {
			if (usedAdditives.indexOf(String(additive.id)) !== -1) {
				result.push(additive.name);
			}
		});
			
		// Some nice hack: Remove the last commata with an "and"
		var message = result.join(', ');
		
		if (message.lastIndexOf(', ') !== -1) {
			message = setCharAt(message, message.lastIndexOf(', '), ' ' + L('and') + ' ');
		}
		
		$.alert.setMessage(message);
		$.alert.show();
	} catch(e) {
		Ti.API.error('No assets/json/additives.json available:'); 
		Ti.API.error(e);
	}	
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}
