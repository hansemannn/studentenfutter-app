var parent,
	productId;

/**
 *  Constructor
 */
(function constructor(args) {	
	parent = args.parent;	
	productId = args.productId;
})(arguments[0] || {});

function setRating() {
	var LoaderInstance = require('/loader');
	var api = require('/api');
	
	var loader = new LoaderInstance(parent);
	loader.show();
	
	api.postRating({
		productId: productId,
		value: 5
	}, function(e) {		
		if (e.success) {
			$.rating.setImage('/images/icons/successCheck.png');			
		} else {
			$.rating.setImage('/images/icons/errorCross.png');			
		}	
		
		loader.hide();
		setTimeout(hide, 1000);	
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

exports.show = function() {
	parent.add($.container);

	$.container.animate({
		opacity: 1,
		duration: 500
	});
};
