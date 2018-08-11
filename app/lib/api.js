import Request from 'request';

function performFallback(cb) {
	const dummyLunches = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/lunches.json');

	// Simulate HTTP request
	setTimeout(function () {
		try {
			cb(Object.assign(JSON.parse(dummyLunches.read()), { success: true }));
		} catch (e) {
			Ti.API.error('Unable to parse JSON: ' + e);
			cb({ success: false });
		}
	}, 1000);
}

/**
 * Fallback for contributors
 * @param {Function} cb The Callback to invoke once finished loading contributors.
 */
function contribFallback(cb) {
	const dummyContrib = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/contributors.json');

	// Simulate HTTP request
	setTimeout(function () {
		try {
			cb(Object.assign(JSON.parse(dummyContrib.read()), { success: true }));
		} catch (e) {
			Ti.API.error('Unable to parse JSON: ' + e);
			cb({ success: false });
		}
	}, 1000);
}

/**
 * Posts a new product image.
 * @param {Object} params The POST parameter containing the image data.
 * @param {Function} cb The callback to be invoked after the asyncronous request.
 * @param {Function} onProgess The callback to be invoked after a progress is received.
 */
exports.postProductImage = function (params, cb, onProgess) {
	try {
		const request = new Request({
			url: '/images/new',
			type: 'POST',
			data: params,
			isFileUpload: true,
			process: (e) => {
				onProgess && onProgess(e);
			},
			success: json => {
				cb(Object.assign(json, { success: true }));
			},
			error: () => {
				cb({ success: false });
			}
		});
		request.load();
	} catch (e) {
		performFallback(cb);
	}
};

/**
 *	Posts a new rating.
 *	@param {Object} params The POST parameter containing the rating value.
 *	@param {Function} cb The callback to be invoked after the asyncronous request.
 */
exports.postRating = function (params, cb) {
	const productIdentifier = 'rating-' + params.productId + '-' + Ti.Platform.id;

	if (Ti.App.Properties.getBool(productIdentifier, false)) {
		cb({ success: false });
		return;
	}

	try {
		const request = new Request({
			url: '/ratings/new',
			type: 'POST',
			data: {
				productId: params.productId,
				userId: Ti.Platform.id,
				value: params.rating
			},
			success: json => {
				Ti.App.Properties.setBool(productIdentifier, true);
				cb(json);
			},
			error: () => {
				cb({ success: false });
			}
		});
		request.load();
	} catch (e) {
		performFallback(cb);
	}
};

/**
 *	Gets all lunches
 *	@param {Object} params The GET parameter to form the URL.
 *	@param {Function} cb The callback to be invoked after the asyncronous request.
 */
exports.getLunches = function (params, cb) {
	try {
		const request = new Request({
			url: '/lunches/list/' + params.date + '/' + params.location,
			type: 'GET',
			success: json => {
				cb(Object.assign(json, { success: true }));
			},
			error: () => {
				cb({ success: false });
			}
		});
		request.load();
	} catch (e) {
		Ti.API.error(e);
		performFallback(cb);
	}
};

/**
 * Get all contributors
 * @param {Function} cb The callback to be invoked after the asyncronous request.
 */
exports.getContrib = function (cb) {
	try {
		const request = new Request({
			url: 'https://api.github.com/repos/hansemannn/studentenfutter-app/contributors',
			external: true,
			type: 'GET',
			success: json => {
				cb(Object.assign(json, { success: true }));
			},
			error: () => {
				cb({ success: false });
			}
		});
		request.load();
	} catch (ex) {
		contribFallback(cb);
	}
};
