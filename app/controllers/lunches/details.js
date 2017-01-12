var nav,
	product,
	utils;

/**
 *  Constructor
 */
(function constructor(_product) {
	product = _product;
	utils = require("utils");
	
	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.details
		});
	}
	
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

	// FIXME: This is throwing an error
	// ratingCell.rating.image = utils.formattedStars(product.rating, "big");
	additivesCell.additives.text = hasAdditives ? product.additives.length : 0;
	
	if (!hasAdditives) {
		additivesCell.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		additivesCell.additives.right = 15;
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
	
	$.list.deselectItem(e.sectionIndex, e.itemIndex);
}
