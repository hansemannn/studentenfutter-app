var nav,
	product;

/**
 *  Constructor
 */
(function constructor(_product) {
	product = _product;
	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.details
		});
	}
	
	setUI();
})(arguments[0] || {});

function setUI() {

}

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.details.close();
    }
}

exports.open = function(animated) {
    if (OS_IOS) {
        nav.open({modal: animated});
    } else {
        $.details.open();
    }
};
