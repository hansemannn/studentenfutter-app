/**
 * Returns an image based on the star rating value.
 * @param rating The rating value (between 0.0 - 5.0), nullable
 * @return The assigned rating image resource name.
 */
exports.formattedStars = function(rating) {
    var stars = rating ? rating.value : 0;
    var path = "images/icons/stars/";

    if (stars > 0 && stars < 0.75) {
        return path + "0_5.png";
    } else if(stars >= 0.75 && stars < 1.25) {
        return path + "1_0.png";
    } else if(stars >= 1.25 && stars < 1.75) {
        return path + "1_5.png";
    } else if(stars >= 1.75 && stars < 2.25) {
        return path + "2_0.png";
    } else if(stars >= 2.25 && stars < 2.75) {
        return path + "2_5.png";
    } else if(stars >= 2.75 && stars < 3.25) {
        return path + "3_0.png";
    } else if(stars >= 3.25 && stars < 3.75) {
        return path + "3_5.png";
    } else if(stars >= 3.75 && stars < 4.25) {
        return path + "4_0.png";
    } else if(stars >= 4.25 && stars < 4.75) {
        return path + "4_5.png";
    } else if(stars >= 4.75) {
        return path + "5_0.png";
    }
    
    return path + "0_0.png";
};


/**
 * Detect whether we're running inside a simulator or not.
 * @return _TRUE_ when running on emulator, _FALSE_ otherwise.
 */
exports.isEmulator = function() {
    return (Ti.Platform.manufacturer == 'Genymotion' || Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1);
};

/**
 * Returns whether or not the device runs iOS 10+.
 * @return _TRUE_ when running on iOS 10+, _FALSE_ otherwise.
 */
exports.isiOS10 = function() {
    return parseInt(Titanium.Platform.version.split(".")[0]) >= 10;
};

/**
 * Triggers a new haptic selection on supported devices.
 */
exports.selectionChanged = function() {
    
    // FIXME: I found an issue when running on kroll-thread using this method
    // The fix is already in place (TIMOB-24314)
    return;
    
    var feedback = Ti.UI.iOS.createFeedbackGenerator({
        type: Ti.UI.iOS.FEEDBACK_GENERATOR_TYPE_SELECTION
    });
    feedback.prepare();
    feedback.selectionChanged();
}
