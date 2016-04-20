var nav,
    loader,
    LoaderInstance,
    dateutils,
    LunchState,
    currentLunchState,
    lunches;

/**
 *  Constructor
 */
(function constructor(args) {
    initializeLoader();
    initializeDate();
    
    LunchState = {
        Student: 0,
        Emloyee: 1
    };
    
    currentLunchState = LunchState.Student;        
    
    if (OS_IOS) {
        nav = createNavigationWindow();
    }
})(arguments[0] || {});

function onGroupSelected(state) {
    currentLunchState = state;
    setUI();
}

function initializeLoader() {
    LoaderInstance = require("loader");
    loader = new LoaderInstance($.window);
}

function initializeDate() {
    dateutils = require("dateutils");
    $.window.setTitle("Heute, " + dateutils.getToday());
}

function createNavigationWindow() {
    return Ti.UI.iOS.createNavigationWindow({
        window: $.window
    });
}

function toggleNextDay() {
    $.window.setTitle(dateutils.increment());
    fetchData();
}

function togglePreviousDay() {
    $.window.setTitle(dateutils.decrement());
    fetchData();
}

function handleListItemClick(e) {
    var id = e.itemId;
    openDetails(id);
}

function openDetails(id) {
    Ti.API.warn(id);
}

function fetchData() {
    loader.show();
    
    var api = require("api");
    api.getLunches({
        date: dateutils.getCurrentDateSlug(), 
        location: 0
    }, function(e) {
        lunches = e;
        setUI();
        loader.hide();
    });
}

function setUI() {
    if (OS_IOS) {
        $.refresh.endRefreshing();
    }
    
    var categories = [L("Hauptgericht"), L("Beilagen"), L("Dessert"), L("Tagessalat"), L("Essen_Hochschulbedienstete", "Essen Hochschulbedienstete"), L("Eintopf_Teller", "Eintopf Teller")];
    var sections = [];
    
    _.each(categories, function(category) {
        var section = Ti.UI.createListSection({
            headerTitle: category
        });

        var cells = [];
        
        _.each(lunches, function(lunch) {
            if (L(lunch.category, lunch.category) != category) {
                return;
            }
            
            cells.push({
                properties: {
                    itemId: lunch.id,
                    height: Ti.UI.SIZE,
                    backgroundColor: "#fff",
                    selectionStyle : (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null,
                },
                image: {
                    backgroundColor: "red",
                    width: lunch.images.length > 0 ? 17 : 0
                },
                lunchTitle: {
                    left: lunch.images.length > 0 ? 10 : 0,
                    text: lunch.name
                },
                lunchAdditives: {
                    text: lunch.additives ? lunch.additives.length + " Zusätze" : "Keine Zusätze"
                },
                lunchPrice: {
                    text: currentLunchState == LunchState.Student ? lunch.priceStudent.split("€")[0] : lunch.priceOfficial.split("€")[0]
                },
                star1: {
                    image: "/images/icons/stars/small/full_star.png"
                },
                star2: {
                    image: "/images/icons/stars/small/full_star.png"
                },
                star3: {
                    image: "/images/icons/stars/small/full_star.png"
                },
                star4: {
                    image: "/images/icons/stars/small/full_star.png"
                },
                star5: {
                    image: "/images/icons/stars/small/full_star.png"
                },
                scoreOfRating: {
                    text: lunch.rating ? lunch.rating.value : "0"
                },
                numberOfRating: {
                    text: lunch.rating ? lunch.rating.count : "0"
                }
            });        
        });
        section.setItems(cells);
        section.getItems().length > 0 && sections.push(section);
    });
    
    $.listView.setSections(sections);
}

function open() {
    if (OS_IOS) {
        nav.open();
    } else {
        $.window.open();
    }
}

exports.open = open;