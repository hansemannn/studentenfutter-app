var nav,
	product;

/**
 *  Constructor
 */
(function constructor(_product) {
	product = _product;
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
}

function setImages() {
	var images = product.images || null;
	var views = [];
	
	if (images.length < 2) {
		$.images.setShowPagingControl(false);
	}
	
	if (!images || images.length == 0) {
		return;
	}
	
	$.images.removeAllChildren();
	$.placeholder.hide();
	
	// TODO: Move to Alloy-based generation
		
	_.each(images, function(image) {
		var view = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.SIZE,
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
