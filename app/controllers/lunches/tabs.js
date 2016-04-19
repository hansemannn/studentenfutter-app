var onGroupSelected;

/**
 *  Constructor
 */
(function constructor(args) {
    onGroupSelected = args.onGroupSelected;
    $.tabbedBar.setIndex(Ti.App.Properties.getInt("currentPersonID", 0));
})(arguments[0] || {});

function toggleList(e) {
    onGroupSelected && onGroupSelected(e.index);
}