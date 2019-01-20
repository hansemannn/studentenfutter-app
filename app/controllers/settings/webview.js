let pathIdentifier;

/**
 * Constructor
 **/
(function constructor(_pathIdentifier) {
	pathIdentifier = _pathIdentifier;
	$.webview.title = L(pathIdentifier) || '';

	if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.webview);
	}
}(arguments[0] || null));

function initializeWebView() {
	const path = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'html/' + pathIdentifier + '.html');

	if (!path.exists()) {
		Ti.API.error('File at path not found: ' + path.nativePath);
		return;
	}

	$.webView.setData(path.read());
}
