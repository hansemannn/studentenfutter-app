var nav,
	image;

/**
 *  Constructor
 */
(function constructor(args) {
	image = args.image;
	$.image.setImage(image);
	
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

function share() {
	alert('TODO: Share!');
}

function zoom() {
	this.setZoomScale((this.getZoomScale() == 1) ? 2 : 1, {
		animated:true
	});
}
