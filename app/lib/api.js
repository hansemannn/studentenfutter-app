function performFallback(cb) {
	const dummyLunches = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/lunches.json');
				
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
 * Fallback for contributors
 */
function contribFallback(cb) {
	const dummyContrib = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/contributors.json');
				
	// Simulate HTTP request	
	setTimeout(function() {
		try {
			cb(_.extend(JSON.parse(dummyContrib.read()), {success: true}));
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
		const auth = require('/auth');
		const RequestInstance = require('/request');
				
		const request = new RequestInstance({
			url : '/images/new',
			type : 'POST',
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
	}
};

/**
 *	Posts a new rating.
 *	@param {Object} data The POST parameter containing the rating value. 
 *	@param {Callback} cb The callback to be invoked after the asyncronous request.
 *	@return void
 */
exports.postRating = function(params, cb) {
	const productIdentifier = 'rating-' + params.productId + '-' + Ti.Platform.id;
	
	if (Ti.App.Properties.getBool(productIdentifier, false)) {
		cb({success: false});
		return;
	}
	
	try {
		const auth = require('/auth');
		const RequestInstance = require('/request');
				
		const request = new RequestInstance({
			url : '/ratings/new',
			type : 'POST',
			data: {
				productId: params.productId,
				userId: Ti.Platform.id,
				value: params.rating
			},
			success: function(json) {
				Ti.App.Properties.setBool(productIdentifier, true);
				cb(json);
			},
			error: function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(e) {
		performFallback(cb);
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
		const auth = require('/auth');
		const RequestInstance = require('/request');
		
		const request = new RequestInstance({
			url : '/lunches/list/' + params.date + '/' + params.location,
			type : 'GET',
			success : function(json) {
				cb(_.extend(json, {success: true}));
			},
			error : function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(e) {
		alert(e);
		Ti.API.error(e);

		performFallback(cb);
	}
};

/**
 * Get all contributors
 * @param {Object} params The GET parameter to form the URL.
 * @param {Callback} cb The callback to be invoked after the asyncronous request.
 * @return void
 */
exports.getContrib = function(cb) {
	try {
		const RequestInstance = require('/request');
		const request = new RequestInstance({
			url : 'https://api.github.com/repos/hansemannn/studentenfutter-app/contributors',
			external: true,
			type : 'GET',
			success : function(json) {
				cb(_.extend(json, {success: true}));
			},
			error : function() {
				cb({success: false});
			}
		});
		request.load();
	} catch(ex) {
		contribFallback(cb);
	}
};
