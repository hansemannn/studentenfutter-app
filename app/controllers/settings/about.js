var nav;

/**
 *  Constructor
 */
(function constructor(args) {
    if (OS_IOS) {
        nav = Ti.UI.iOS.createNavigationWindow({
            window: $.window
        });
    }
})(arguments[0] || {});

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.window.close();
    }
}

exports.open = function() {
    if (OS_IOS) {
        nav.open({modal: true});
    } else {
        $.window.open();
    }
};
