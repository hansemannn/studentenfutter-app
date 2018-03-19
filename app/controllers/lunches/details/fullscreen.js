let nav;

/**
 *  Constructor
 */
(function constructor(args) {
	const images = args.images;
	const index = args.currentIndex;
	
	images.forEach(function(image) {
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

		scrollView.addEventListener('doubletap', e => {
			$.images.setZoomScale(($.images.getZoomScale() === 1) ? 2 : 1, {
				animated:true
			});
		});
		scrollView.add(Ti.UI.createImageView({
			image: image,
			width: Ti.Platform.displayCaps.platformWidth
		}));
		
		$.images.addView(scrollView);
	});
	
	$.images.setCurrentPage(index);
		
	if (OS_ANDROID) {
    Alloy.Globals.setAndroidBackButton($.window);
  }
})(arguments[0] || {});

function close() {
	image = null;

	if (OS_IOS) {
		nav.close();
	} else {
		$.window.close();
	}
}

exports.show = function() {
	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.window
		});
		nav.open({modal: true});
	} else {
		$.window.open();
	}
};
