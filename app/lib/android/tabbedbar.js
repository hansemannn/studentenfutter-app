/*
	Cross-platform segmented control (TabbedBar)
	by @skypanther

	Requires Ti SDK 1.8+ (or modify makeTabbedBar to use Ti.UI.createTabbedBar instead of Ti.UI.iOS.createTabbedBar)

	Usage:
	const tbar = require('/path/custTabBar').makeTabbedBar({paramObj}, _fn);

	Params:
		{paramObj} is map of properties to match those defined by Ti.UI.iOS.TabbedBar, see DEFAULTS below for list of params that can be set on Android (all the native props are supported on iOS)
		_fn is a is a function to be called when a button on the tabbed bar is clicked, it will be passed the index of the button clicked

	iOS: returns an instance of Ti.UI.iOS.TabbedBar
	Android: returns custom UI control to mimic TabbedBar

*/

const DEFAULTS = {
	labels: [ 'One', 'Two' ],
	index: 1,
	width: 300,
	backgroundColor: '#ccc',
	backgroundSelectedColor: 'blue',
	borderColor: '#fff',
	borderWidth: 0,
	height: 'auto',
	androidHeight: 40,
	color: '#000',
	fontWeight: 'normal',
	fontSize: 16
};

exports.makeTabbedBar = function (/* map*/_params, /* function*/ _fn) {
	if (OS_ANDROID) {
		// build pseudo tabbed bar for Android
		const wrapper = Ti.UI.createView({
			id: 'root',
			width: (_params.width) ? _params.width : DEFAULTS.width,
			height: (_params.height) ? _params.height : DEFAULTS.androidHeight,
			top: (_params.top) ? _params.top : DEFAULTS.top,
			left: (_params.left) ? _params.left : DEFAULTS.left
		});
		const numButtons = (_params.labels.length) ? _params.labels.length : DEFAULTS.labels.length;
		// need to calculate width of sub-buttons, but view.width could have been set as a string
		const tmpWidth = (_params.width) ? _params.width : DEFAULTS.width;
		let subBtnWidth = 0;
		if (typeof(tmpWidth) === 'number') {
			subBtnWidth = Math.round(tmpWidth / numButtons);
		} else if (typeof(tmpWidth) === 'string' && !isNaN(parseInt(tmpWidth))) {
			// looks like we've got a percentage width
			subBtnWidth = Math.round((parseInt(tmpWidth) / 100 * Ti.Platform.displayCaps.platformWidth) / numButtons);
		} else {
			// looks like 'auto' was used
			subBtnWidth = Math.round((0.9 * Ti.Platform.displayCaps.platformWidth) / numButtons);
		}

		let btnArray = [];
		for (let i = 0; i < numButtons; i++) {
			// create the sub-buttons
			const subBtn = Ti.UI.createView({
				backgroundColor: (_params.backgroundColor) ? _params.backgroundColor : DEFAULTS.backgroundColor,
				borderColor: (_params.borderColor) ? _params.borderColor : DEFAULTS.borderColor,
				borderWidth: (_params.borderWidth) ? _params.borderWidth : DEFAULTS.borderWidth,
				left: (i * subBtnWidth) + 3,
				width: subBtnWidth,
				height: (_params.height) ? _params.height : DEFAULTS.androidHeight,
				myIndex: i
			});
			subBtn.add(Ti.UI.createLabel({
				text: _params.labels[i],
				width: subBtnWidth,
				height: (_params.height) ? _params.height : DEFAULTS.androidHeight,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				color: '#51ccf3',
				font: {
					fontWeight: (_params.fontWeight) ? _params.fontWeight : DEFAULTS.fontWeight,
					fontSize: (_params.fontSize) ? _params.fontSize : DEFAULTS.fontSize
				}
			}));
			subBtn.add(Ti.UI.createView({
				backgroundColor: (_params.backgroundColor) ? _params.backgroundColor : DEFAULTS.backgroundColor,
				height: 2,
				bottom: 0,
				width: subBtnWidth
			}));

			if (i === _params.index) {
				subBtn.children[1].backgroundColor = (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
				// subBtn.backgroundColor = (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
			}

			btnArray.push(subBtn);
			wrapper.add(subBtn);
		}
		wrapper.addEventListener('click', (e) => {
			for (let i = 0; i < numButtons; i++) {
				btnArray[i].children[0].setColor('#51ccf3');
				btnArray[i].children[1].backgroundColor = (_params.backgroundColor) ? _params.backgroundColor : DEFAULTS.backgroundColor;
			}
			if (e.source.myIndex) {
				// e.source.children[0].setColor('#fff');
				e.source.children[1].backgroundColor = (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
				// e.source.backgroundColor =  (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
			} else {
				e.source.parent.children[1].backgroundColor =  (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
				// e.source.parent.backgroundColor =  (_params.backgroundSelectedColor) ? _params.backgroundSelectedColor : DEFAULTS.backgroundSelectedColor;
			}

			if (_fn) {
				_fn(e.source.myIndex >= 0 ? e.source.myIndex : (e.source.parent.myIndex) ? e.source.parent.myIndex : 0);
			}
		});
		return wrapper;
	}
}; // end makeTabbedBar
