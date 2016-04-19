var onSettingsClicked,
    onInfosClicked;

/**
 *  Constructor
 */
(function constructor(args) {
    onSettingsClicked = args.onSettingsClicked || null;
    onInfosClicked = args.onInfosClicked || null;
})(arguments[0] || {});

function openSettings() {
    onSettingsClicked && onSettingsClicked();
}

function openInfos() {
    onInfosClicked && onInfosClicked();    
}

function resetAmount() {
    
}