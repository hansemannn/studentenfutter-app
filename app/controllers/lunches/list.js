var nav,
    loader,
    LoaderInstance,
    dateutils,
    LunchState,
    currentLunchState,
    cart,
    lunches;

/**
 *  Constructor
 */
(function constructor(args) {    
    LunchState = {
        Student: 0,
        Employee: 1
    };
    
    currentLunchState = LunchState.Student;      
    cart = Alloy.Models.cart;     
    dateutils = require("dateutils");
   
    $.tabs.onGroupSelected(onGroupSelected);
    $.footer.onSettingsUpdated(onSettingsUpdated);
    
    cart.on("update", function(summary) {
        $.footer.updateTotalSummary(summary);
    });
    
    cart.on("reset", setUI);

    if (OS_IOS) {
        nav = createNavigationWindow();
        $.listView.setPreviewContext(createPreviewContext());
    }
    
    initializeLoader();
    initializeDate();

})(arguments[0] || {});

function createPreviewContext() {	
	
    if (!OS_IOS || Ti.UI.iOS.forceTouchSupported === false) {
        return;
    }
	
    var previewContext = Ti.UI.iOS.createPreviewContext({
		preview: createPreviewView(),
		contentHeight: 400
	});			
	
	previewContext.addEventListener("peek", function(e) {
        var product = _.findWhere(lunches, {id: e.itemId});
		var images = product ? product.images : null;
		var preview = $.listView.getPreviewContext().preview;

		if (images && images.length > 0) {
			preview.children[0].setImage(images[0]);
		} else {
            preview.children[0].setImage("/images/noImage.png");
        }
	});

	previewContext.addEventListener("pop", function(e) {
        openDetails(e.itemId, false);
	});    
    
    return previewContext;
}

function createPreviewView() {
    var preview = Ti.UI.createView({
		borderRadius: 20,
		backgroundColor: "#fff",
		height: Ti.UI.SIZE
	});
    	
	preview.add(Ti.UI.createImageView({
        borderRadius: 20,
        defaultImage: "/images/noImage.png"
    }));
    
    return preview;
}

function onGroupSelected(state) {
    currentLunchState = state;
    setUI();
}

function onSettingsUpdated(e) {
    switch (e.action) {
        case "selectCanteen":
            fetchData({
                force: false
            });
            break;
        case "changePreference":
            setUI();
            break;
    }    
}

function initializeLoader() {
    LoaderInstance = require("loader");
    loader = new LoaderInstance($.window);
}

function initializeDate() {
    $.window.setTitle(dateutils.getFormattedDate());
}

function createNavigationWindow() {
    return Ti.UI.iOS.createNavigationWindow({
        window: $.window
    });
}

function onRefreshStart() {
    fetchData({
        force: true
    });
}

function toggleNextDay() {
    dateutils.increment();
    fetchData({
        force: false
    });
}

function togglePreviousDay() {
    dateutils.decrement();
    fetchData({
        force: false
    });
}

function handleListItemClick(e) {
    openDetails(e.itemId, true);
}

function openDetails(itemId, animated) {
    // TODO: Move all products to Models
    var product = _.findWhere(lunches, {
		id: itemId
	});
    
    if (!product) {
        Ti.API.error("Could not find product with ID = " + itemId);
        return;
    }
    
    Alloy.createController("lunches/details", product).open(animated);
}

function fetchData(args) {
    !args.force && loader.show();
    $.window.setTitle(L("loading"));
    
    var api = require("api");
    api.getLunches({
        date: dateutils.getCurrentDateSlug(), 
        location: Ti.App.Properties.getInt("currentLocationID", Alloy.CFG.defaultCanteen.id)
    }, function(e) {
        lunches = e;
        setUI();
        !args.force && loader.hide();
    });
}

function setUI() {
    if (OS_IOS) {
        $.refresh.endRefreshing();
    }
    
    var showAdditives = Ti.App.Properties.getBool("showAdditives", true);
    var showRatings = Ti.App.Properties.getBool("showRatings", true);
    
    var categories = [L("Hauptgericht"), L("Beilagen"), L("Dessert"), L("Tagessalat"), L("Essen_Hochschulbedienstete", "Essen Hochschulbedienstete"), L("Eintopf_Teller", "Eintopf Teller")];
    var sections = [];
    
    cart.resetTotal(false);

    _.each(categories, function(category) {
        var section = Alloy.createController("lunches/section", {
            title: category
        }).getView();

        var cells = [];

        _.each(lunches, function(lunch) {
            if (L(lunch.category, lunch.category) != category) {
                return;
            }
            
            var hasAdditives = lunch.additives && lunch.additives.length;
            var price = currentLunchState == LunchState.Student ? lunch.priceStudent.split(" €")[0] : lunch.priceOfficial.split(" €")[0];
                
            var attr = {
                itemId: lunch.id,
                count: 0,
                price: price,
                properties: {
                    itemId: lunch.id,
                    height: Ti.UI.SIZE,
                    backgroundColor: "#fff",
                    selectionStyle : (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null,
                },
                image: {
                    width: lunch.images.length > 0 ? 17 : 0
                },
                buttonRemove: {
                    visible: false
                },
                lunchTitle: {
                    left: lunch.images.length > 0 ? 5 : 0,
                    text: lunch.name
                },
                lunchCountContainer: {
                    visible: false
                },
                lunchCount: {
                    text: 0
                },
                lunchPriceContainer: {

                },
                lunchPrice: {
                    text: price
                }
            };
            
            if (showAdditives) {
                attr["lunchAdditives"] = {
                    text: formattedAdditives(hasAdditives ? lunch.additives.length : 0)
                };
            } else {
                attr["lunchAdditives"] = null;
            }
            
            if (showRatings) {
                attr["fullStars"] = {
                    image: formattedStars(lunch.rating)
                };
                attr["scoreOfRating"] = {
                    text: lunch.rating ? lunch.rating.value : 0
                };
                attr["numberOfRating"] = {
                    text: lunch.rating ? lunch.rating.count : 0
                };
            } else {
                attr["fullStars"] = null;
                attr["scoreOfRating"] = null;
                attr["numberOfRating"] = null;
            }
                                    
            cells.push(attr);        
        });
        section.setItems(cells);
        section.getItems().length > 0 && sections.push(section);
    });
    
    $.listView.setSections(sections);
    $.window.setTitle(dateutils.getFormattedDate());
    $.placeholder[sections.length > 0 ? "hide" : "show"]();
}

function formattedAdditives(count) {
    if (count == 0) {
        return "Keine Zusätze";
    } else if (count == 1) {
        return "1 Zusatz";
    }
    return count + " Zusätze";
}

function formattedStars(rating) {
    var stars = rating ? rating.value : 0;
    var path = "images/icons/stars/small/";

    if (stars > 0 && stars < 0.75) {
        return path + "0_5.png";
    } else if(stars >= 0.75 && stars < 1.25) {
        return path + "1_0.png";
    } else if(stars >= 1.25 && stars < 1.75) {
        return path + "1_5.png";
    } else if(stars >= 1.75 && stars < 2.25) {
        return path + "2_0.png";
    } else if(stars >= 2.25 && stars < 2.75) {
        return path + "2_5.png";
    } else if(stars >= 2.75 && stars < 3.25) {
        return path + "3_0.png";
    } else if(stars >= 3.25 && stars < 3.75) {
        return path + "3_5.png";
    } else if(stars >= 3.75 && stars < 4.25) {
        return path + "4_0.png";
    } else if(stars >= 4.25 && stars < 4.75) {
        return path + "4_5.png";
    } else if(stars >= 4.75) {
        return path + "5_0.png";
    }
    
    return path + "0_0.png";
}

function open() {
    if (OS_IOS) {
        nav.open();
    } else {
        $.window.open();
    }
}

function incrementPrice(e) {
    var item = e.section.getItemAt(e.itemIndex);
    
    item.count++;
    item.lunchCount.text = item.count;
    cart.increment(item.price);

    // First Increment
    if (item.count == 1) {
        item.buttonRemove.visible = true;
        item.lunchCountContainer.visible = true;
        item.lunchPriceContainer.backgroundImage = "/images/priceBgSelected.png";
        item.properties.backgroundColor = "#f3fdff";
    }
    
    e.section.updateItemAt(e.itemIndex, item);
}

function decrementPrice(e) {
    var item = e.section.getItemAt(e.itemIndex);
        
    item.count--;
    item.lunchCount.text = item.count;
    cart.decrement(item.price);
    
    // Last Decrement
    if (item.count == 0) {
        item.buttonRemove.visible = false;
        item.lunchCountContainer.visible = false;
        item.lunchPriceContainer.backgroundImage = "/images/priceBg.png";
        item.properties.backgroundColor = "#fff";
    }    

    e.section.updateItemAt(e.itemIndex, item);    
}

exports.open = open
