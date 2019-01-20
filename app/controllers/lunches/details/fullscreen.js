let nav;

/**
 *  Constructor
 */
(function constructor(args) {
	const images = args.images;
	const index = args.currentIndex;

	images.forEach(image => {
		const scrollView = Ti.UI.createScrollView({
			contentWidth: 'auto',
			contentHeight: 'auto',
			top: 0,
			bottom: 0,
			backgroundColor: '#000',
			showVerticalScrollIndicator: false,
			showHorizontalScrollIndicator: false,
			maxZoomScale: 2,
			minZoomScale: 1,
			zoomScale: 1,
		});

		scrollView.addEventListener('doubletap', () => {
			scrollView.setZoomScale((scrollView.zoomScale === 1) ? 2 : 1, {
				animated: true
			});
		});

		scrollView.add(Ti.UI.createImageView({
			image: downscaledImage(image),
			width: Ti.Platform.displayCaps.platformWidth
		}));

		$.images.addView(scrollView);
	});

	$.images.currentPage = index;

	if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.window);
	}
}(arguments[0] || {}));

function downscaledImage(image) {
	if (OS_IOS) {
		return image; // iOS does not need to down-size
	}

	// For Android, downsize until the Bitmap drawing bug is fixes
	// TODO: Cache image to file, compress image, cleanup on close
	// OR: Fix TIMOB-24379
	return image;
}

function close() {
	if (OS_IOS) {
		nav.close();
	} else {
		$.window.close();
	}
}

exports.show = function () {
	if (OS_IOS) {
		nav = Ti.UI.createNavigationWindow({
			window: $.window
		});
		nav.open({ modal: true });
	} else {
		$.window.open();
	}
};
