var loader,
    LoaderInstance;

/**
 *  Constructor
 */
( function constructor( args ) {

    initializeLoader();

} )( arguments[ 0 ] || {} );


function initializeLoader() {
    LoaderInstance = require( "/loader" );
    loader = new LoaderInstance( $.window );
}

function populateContributors() {
    var api = require( "/api" );
    loader.show();

    var items = [];
    api.getContrib( {

    }, function( payload ) {
        console.log( payload[ 0 ].login );

        payload.map( function( contrib ) {
            items.push( {
                properties: {
                    itemId: contrib.id,
                    template: 'contrib'
                },
                avatar: {
                    image: contrib.avatar_url
                },
                title: {
                    text: contrib.login
                }
            } );
        } );
        $.section.setItems( items );
        loader.hide();
    } );
  
}
