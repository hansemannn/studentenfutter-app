var pathIdentifier;

/**
 * Constructor
 **/
(function constructor(_pathIdentifier) {
	pathIdentifier = _pathIdentifier;
	$.webview.setTitle(L(pathIdentifier) || "");
	
	if (OS_ANDROID) {
		Alloy.Globals.setAndroidBackButton($.webview);
	}
})(arguments[0] || null);

function initializeWebView() {
    var path = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), "html/" + pathIdentifier + ".html");
    
    if (!path.exists()) {
        Ti.API.error("File at path not found: " + path.nativePath);
        return;
    }
    
    $.webView.setData(path.read());
}
