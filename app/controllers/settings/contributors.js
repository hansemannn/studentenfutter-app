/**
*  Constructor
*/
(function constructor(args) {    

})(arguments[0] || {});
   
function populateContributors() {
    var LoaderInstance = require("/loader");
    var loader = new LoaderInstance($.window);

    var api = require("/api");
    loader.show();

    api.getContrib(function(e) {
        var items = [];
        
        e.map(function(contributor) {
            items.push({
                properties: {
                    itemId: contributor.id,
                    username: contributor.login,
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE 
                },
                avatar: {
                    image: contributor.avatar_url
                },
                title: {
                    text: contributor.login
                },
                subtitle: {
                    text: contributor.contributions + ' ' + L('contributions')
                }
            });
        });
        
        $.section.setItems(items);
        loader.hide();
    });
}

function showContributorPage(e) {
    var item = e.section.getItemAt(e.itemIndex);
    var username = item.properties.username;
    var githubURL = 'https://github.com/' + username;
    
    if (OS_ANDROID) {
        Ti.Platform.openURL(githubURL);
    } else {    
        var safariDialog = require('ti.safaridialog');
        
        if (!safariDialog.isSupported()) {
            Ti.Platform.openURL(githubURL);
        } else {
            safariDialog.open({
                url: githubURL,
                tintColor: Alloy.CFG.styles.tintColor,
                animted: true
            });    
        }        
    }
}
