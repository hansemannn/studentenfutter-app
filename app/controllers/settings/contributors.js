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
                    template: 'contrib'
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
