/**
 * Returns an image based on the star rating value.
 * @param {Object} rating The rating value (between 0.0 - 5.0), nullable
 * @return {String} The assigned rating image resource name.
 */
export function formattedStars(rating) {
	const stars = rating ? rating.value : 0;
	const path = 'images/icons/stars/';

	if (stars > 0 && stars < 0.75) {
		return path + '0_5.png';
	} else if (stars >= 0.75 && stars < 1.25) {
		return path + '1_0.png';
	} else if (stars >= 1.25 && stars < 1.75) {
		return path + '1_5.png';
	} else if (stars >= 1.75 && stars < 2.25) {
		return path + '2_0.png';
	} else if (stars >= 2.25 && stars < 2.75) {
		return path + '2_5.png';
	} else if (stars >= 2.75 && stars < 3.25) {
		return path + '3_0.png';
	} else if (stars >= 3.25 && stars < 3.75) {
		return path + '3_5.png';
	} else if (stars >= 3.75 && stars < 4.25) {
		return path + '4_0.png';
	} else if (stars >= 4.25 && stars < 4.75) {
		return path + '4_5.png';
	} else if (stars >= 4.75) {
		return path + '5_0.png';
	}

	return path + '0_0.png';
}

/**
 * Detect whether we're running inside a simulator or not.
 * @return {Boolean} `true` when running on emulator, `false` otherwise.
 */
export function isEmulator() {
	return (Ti.Platform.manufacturer === 'Genymotion' || Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1);
}

/**
 * Returns whether or not the device runs iOS 10+.
 * @return {Boolean} `true` when running on iOS 10+, `false` otherwise.
 */
export function isiOS10() {
	return parseInt(Titanium.Platform.version.split('.')[0]) >= 10;
}

/**
 * Triggers a new haptic selection on supported devices.
 */
export function selectionChanged() {
	if (!OS_IOS) {
		return;
	}

	const feedback = Ti.UI.iOS.createFeedbackGenerator({
		type: Ti.UI.iOS.FEEDBACK_GENERATOR_TYPE_SELECTION
	});
	feedback.prepare();
	feedback.selectionChanged();
}
