var Loader = function(_view) {
	var view = _view;
	var loggingInView = null;
	var spinner = null;
	var visible = false;

	this.show = function() {

		if (Ti.Platform.osname == "android") {
			loggingInView = Ti.UI.Android.createProgressIndicator({
				message : L('loading'),
				location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG, // display in dialog
				type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT, // display a spinner
				cancelable : true
			});
			loggingInView.show();
		} else {
			loggingInView = Ti.UI.createView({width: Ti.UI.FILL, height: Ti.UI.FILL});
			spinner = Ti.UI.createView({
				borderRadius : 10,
				width : 52,
				height : 52,
				borderRadius: 26,
				backgroundColor: "#CC000000",
				zIndex : 8888
			});

			loggingInIndicator = Ti.UI.createActivityIndicator({
				height : 50,
				zIndex : 9999,
				style : Ti.UI.ActivityIndicatorStyle.BIG
			});

			spinner.add(loggingInIndicator);
			loggingInView.add(spinner);
			loggingInIndicator.show();

			view.add(loggingInView);

			spinner.animate({
				duration : 150,
				transform : Ti.UI.create2DMatrix({
					scale : 1.0
				}),
			});
		}
		
		this.setVisible(true);
	};

	this.hide = function(_type) {

		if (OS_ANDROID) {
			loggingInView.hide();
		} else {
			if (loggingInView != undefined) {
				spinner.animate({
					opacity : 0,
					duration : 250
				}, function() {
					view.remove(loggingInView);
				});
			}
		}
		
		this.setVisible(false);
	};
	
	this.setVisible = function(_visible) {
		visible = _visible;
	};
	
	this.isVisible = function() {
		return visible;
	};
};

module.exports = Loader;
