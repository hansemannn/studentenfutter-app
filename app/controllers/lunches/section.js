/**
 *  Constructor
 */
(function constructor(args) {
    $.title.setText(L(args.title.replace(" ","_"), args.title).toUpperCase());
    
    // Hacky fix for native grouped tableview to keep first section in format
    if (OS_IOS && args.index === 0) {
        $.container.setHeight(25);
    }
})(arguments[0] || {});
