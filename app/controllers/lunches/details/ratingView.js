var parent,
	productId,
	rating;

/**
 *  Constructor
 */
(function constructor(args) {	
	parent = args.parent;	
	productId = args.productId;
	
	generateRatingUI();
})(arguments[0] || {});

function setRating(e) {
	rating = e.source.userData ? e.source.userData.value : null;
	
	if (!rating) {
		return;
	}
		
	// TODO: Find smarter way for this midnight hacking!
	
	for (var i = 1; i <= rating; i++) {
		$.rating.children[i - 1].setImage('/images/icons/singleStarFull.png');
	}
	
	if (rating < 5) {
		for (var i = rating + 1; i <= 5; i++) {
			$.rating.children[i - 1].setImage('/images/icons/singleStarEmpty.png');
		} 	
	}	

	$.cancel.setEnabled(true);
	$.submit.setEnabled(true);
}

function submitRating() {
	if (!rating) {
		Ti.API.error('State error: Should have selected at least 1 at this point!');
		return;
	}
	
	var LoaderInstance = require('/loader');
	var api = require('/api');
	
	var loader = new LoaderInstance(parent);
	loader.show();
	
	api.postRating({
		productId: productId,
		value: rating
	}, function(e) {		
		loader.hide();
		hide();
	});
}

function hide() {
	$.container.animate({
		opacity: 0,
		duration: 500
	}, function() {
		parent.remove($.container);
	});
}

function generateRatingUI() {
	for (var i = 1; i <= 5; i++) {
		$.rating.add(Ti.UI.createImageView({
			image: '/images/icons/singleStarEmpty.png',
			userData: {
				value: i
			},
			height: 30,
			width: 30
		}));
	}
}

exports.show = function() {
	parent.add($.container);

	$.container.animate({
		opacity: 1,
		duration: 500
	});
	
	$.content.animate({
		height:135, 
		duration: 500
	});
};
