/**
 * A loader class to show a modal loading indicator
 * above the current context (even above modal).
 *
 * Author: Hans Knöchel
 *
 */
export default class Loader {

	/**
	 * The constructor of the loading indicator. It
	 * configures the native API's based on the platform.
	 * @param {Object} options The options passed to the loader.
	 * @param {String} options.view The view to show on the loader (optional).
	 * @param {String} options.title The title to show on the loader (optional).
	 */
	constructor(options = {}) {
		this.view = !this.isAndroid ? Ti.UI.createWindow() : undefined;
		this.title = options.title || L('loading');
		this.viewBased = options.view !== undefined && options.view !== null;

		if (options.view) {
			this.view = options.view;
		}

		if (this.isAndroid) {
			this.activityIndicator = Ti.UI.Android.createProgressIndicator({
				message: this.title,
				location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
				type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
				cancelable: false
			});
		} else {
			this.activityIndicator = Ti.UI.createActivityIndicator({
				style: Ti.UI.ActivityIndicatorStyle.BIG,
				indicatorColor: '#444',
				top: 40
			});
			this.containerView = Ti.UI.createView({ backgroundColor: '#55000000', opacity: 0.0 });
			const indicatorView = Ti.UI.iOS.createBlurView({
				effect: Ti.UI.iOS.BLUR_EFFECT_STYLE_LIGHT,
				width: 200,
				height: 150,
				borderRadius: 20
			});

			const label = Ti.UI.createLabel({
				text: this.title,
				top: 100,
				width: 160,
				textAlign: 'center',
				height: Ti.UI.SIZE,
				font: {
					fontWeight: 'semibold',
					fontSize: 15
				},
				color: '#000'
			});

			indicatorView.add(this.activityIndicator);
			indicatorView.add(label);
			this.containerView.add(indicatorView);

			this.view.add(this.containerView);
		}
	}

	/**
	 * A utility getter to determine if we are on Android or not.
	 *
	 * @return {Boolean} Whether or not the current process runs on Android or not.
	 */
	get isAndroid() {
		return Ti.Platform.osname === 'android';
	}

	/**
	 * Shows the loader. On iOS, it uses a animation to fade in
	 * the parent view before showing the actual loader.
	 */
	show() {
		if (!this.isAndroid) {
			this.activityIndicator.show();
			if (this.viewBased) {
				this.view.add(this.containerView);
			} else {
				this.view.navBarHidden = true;
				this.navigationWindow = Ti.UI.createNavigationWindow({
					window: this.view
				});
				// Using this navigation window config, we can even show loaders above modal windows
				this.navigationWindow.open({
					modal: true,
					modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_OVER_CURRENT_FULL_SCREEN,
					modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE,
					animated: false
				});
			}
			this.containerView.animate({
				opacity: 1.0
			});
		} else {
			this.activityIndicator.show();
		}
	}

	/**
	 * Hides the loader. On iOS, it uses a animation to fade out
	 * the parent view before hiding the actual loader.
	 */
	hide() {
		if (!this.isAndroid) {
			if (this.viewBased) {
				this.view.remove(this.containerView);
			} else {
				setTimeout(() => {
					this.navigationWindow.close();
				}, 500);
			}
		} else {
			this.activityIndicator.hide();
		}
	}
}
