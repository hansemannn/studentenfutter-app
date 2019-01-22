import Request from 'request';

function performFallback(path, cb) {
	const dummyLunches = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, path);

	// Simulate HTTP request
	setTimeout(function () {
		try {
			cb(JSON.parse(dummyLunches.read()));
		} catch (e) {
			Ti.API.error('Unable to parse JSON: ' + e);
			cb(null, 'Cannot fetch data');
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
			success: cb,
			error: () => {
				cb(null, 'Cannot fetch data');
			}
		});
		request.load();
	} catch (e) {
		performFallback('json/lunches.json', cb);
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
		cb(null, 'Cannot post data');
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
				cb(null, 'Cannot post data');
			}
		});
		request.load();
	} catch (e) {
		performFallback('json/lunches.json', cb);
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
			success: cb,
			error: () => {
				cb(null, 'Cannot fetch data');
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
exports.getContributors = function (cb) {
	try {
		const request = new Request({
			url: 'https://api.github.com/repos/hansemannn/studentenfutter-app/contributors',
			external: true,
			type: 'GET',
			success: cb,
			error: () => {
				cb(null, 'Cannot fetch data');
			}
		});
		request.load();
	} catch (ex) {
		performFallback('json/contributors.json', cb);
	}
};
