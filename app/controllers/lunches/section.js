/**
 *  Constructor
 */
(function constructor(args) {
    $.title.setText(L(args.title.replace(" ","_"), args.title).toUpperCase());
})(arguments[0] || {});
