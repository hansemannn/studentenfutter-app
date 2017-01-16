var nav;

/**
 *  Constructor
 */
(function constructor(args) {
	$.image.setImage(args.image);
//	$.window.setTitle(args.title);
})(arguments[0] || {});

function close() {
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
