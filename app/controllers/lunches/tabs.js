var cb;

/**
 *  Constructor
 */
(function constructor(args) {
    $.tabbedBar.setIndex(Ti.App.Properties.getInt("currentPersonID", 0));
})(arguments[0] || {});

function toggleList(e) {
    cb && cb(e.index);
}

exports.onGroupSelected = function(_cb) {
    cb = _cb;
};