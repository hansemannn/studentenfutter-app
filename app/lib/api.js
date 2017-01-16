function performFallback(cb) {
	var dummyLunches = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/lunches.json');
				
	// Simulate HTTP request	
	setTimeout(function() {
		try {
			cb(_.extend(JSON.parse(dummyLunches.read()), {success: true}));
		} catch(e) {
			Ti.API.error('Unable to parse JSON: ' + e);
			cb({success: false});
		} 
	}, 1000);
}

/**
 *	Posts a new product image.
 *	@param {Object} data The POST parameter containing the image data. 
 *	@param {Callback} cb The callback to be invoked after the asyncronous request.
 *	@return void
 */
exports.postProductImage = function(params, cb, onProcess) {
	try {
		var auth = require('/auth');
		var RequestInstance = require('/request');
				
		var request = new RequestInstance({
			url : "/images/new",
			type : "POST",
			data: params,
			isFileUpload: true,
			process: function(e) {
				onProcess && onProcess(e);
			},
			success: function(json) {
				cb(_.extend(json, {success: true}));
			},
			error: function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(e) {
		performFallback(cb);
		return;
	}
};

/**
 *	Posts a new rating.
 *	@param {Object} data The POST parameter containing the rating value. 
 *	@param {Callback} cb The callback to be invoked after the asyncronous request.
 *	@return void
 */
exports.postRating = function(params, cb) {
	try {
		var auth = require('/auth');
		var RequestInstance = require('/request');
				
		var request = new RequestInstance({
			url : "/ratings/new",
			type : "POST",
			data: {
				productId: params.productId,
				userId: Ti.Platform.id,
				value: params.rating
			},
			success: function(json) {
				if (e.success) {
					cb(_.extend(json, {success: true}));
				} else {
					cb(_.extend(json, {success: false}));
				}
			},
			error: function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(e) {
		performFallback(cb);
		return;
	}
};

/**
 *	Gets all lunches
 *	@param {Object} params The GET parameter to form the URL.
 *	@param {Callback} cb The callback to be invoked after the asyncronous request.
 *	@return void
 */
exports.getLunches = function(params, cb) {
	try {
		var auth = require('/auth');
		var RequestInstance = require('/request');
		
		var request = new RequestInstance({
			url : "/lunches/list/" + params.date + "/" + params.location,
			type : "GET",
			success : function(json) {
				cb(_.extend(json, {success: true}));
			},
			error : function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(e) {
		performFallback(cb);
		return;
	}
};
