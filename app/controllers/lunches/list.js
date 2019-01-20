import { selectionChanged, formattedStars } from 'app-utils';
import Loader from 'loader';
import DateUtils from 'dateutils';

const cart = Alloy.Models.cart;
const LunchState = {
	Student: 0,
	Employee: 1
};

let nav;
let loader;
let lunches;
let currentLunchState = LunchState.Student;
let dateutils;

/**
 *  Constructor
 */
(function constructor() {
	dateutils = new DateUtils();

	$.footer.onSettingsUpdated(onSettingsUpdated);

	cart.on('update', function (summary) {
		$.footer.updateTotalSummary(summary);
	});

	cart.on('reset', setUI);

	Ti.App.addEventListener('shortcut:canteenSelected', function (e) {
		$.footer.updateCurrentCanteen(e.title);
		onSettingsUpdated(e);
	});

	if (OS_IOS) {
		nav = createNavigationWindow();
		$.listView.setPreviewContext(createPreviewContext());
	}

	initializeLoader();
	initializeDate();
}(arguments[0] || {}));

function createPreviewContext() {
	if (!OS_IOS || Ti.UI.iOS.forceTouchSupported === false) {
		return;
	}

	const previewContext = Ti.UI.iOS.createPreviewContext({
		preview: createPreviewView(),
		contentHeight: 400
	});

	previewContext.addEventListener('peek', function (e) {
		const product = _.findWhere(lunches, { id: e.itemId });
		const images = product ? product.images : null;
		const preview = $.listView.previewContext.preview;

		if (images && images.length > 0) {
			preview.children[0].setImage(images[0]);
		} else {
			preview.children[0].setImage('/images/noImage.png');
		}
	});

	previewContext.addEventListener('pop', function (e) {
		openDetails(e.itemId, false);
	});

	return previewContext;
}

function createPreviewView() {
	const preview = Ti.UI.createView({
		borderRadius: 20,
		backgroundColor: '#fff',
		height: Ti.UI.SIZE
	});

	preview.add(Ti.UI.createImageView({
		borderRadius: 20,
		defaultImage: '/images/noImage.png'
	}));

	return preview;
}

function onSettingsUpdated(e) {
	switch (e.action) {
		case 'selectCanteen':
			fetchData({
				force: false
			});
			break;
		case 'changePreference':
			currentLunchState = Ti.App.Properties.getInt('currentPersonID', 0);
			setUI();
			break;
	}
}

function initializeLoader() {
	loader = new Loader({ title: L('loading_menu') });
}

function initializeDate() {
	$.window.title = dateutils.formattedDate;
}

function createNavigationWindow() {
	return Ti.UI.createNavigationWindow({
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
	const productID = Number(itemId);
	const product = lunches.find(lunch => lunch.id === productID);

	if (!product) {
		Ti.API.error('Could not find product with ID = ' + productID);
		Ti.API.error(JSON.stringify(lunches));
		return;
	}

	Alloy.createController('/lunches/details/index', {
		product: product,
		onRatingUpdated: onRatingUpdated
	}).open(animated);
}

function onRatingUpdated() {
	fetchData({
		force: true
	});
}

function onOpen() {
	fetchData({ force: false });
}

function promptForRating() {
	if (!OS_IOS) return;

	const TiReviewDialog = require('ti.reviewdialog');
	let numberOfLaunches = Ti.App.Properties.getInt('kStudentenfutterAppLaunches', 0);
	numberOfLaunches++;
	Ti.App.Properties.setInt('kStudentenfutterAppLaunches', numberOfLaunches);

	Ti.API.debug(`Number of launches: ${numberOfLaunches}`);

	if (numberOfLaunches === 3 &&  TiReviewDialog.isSupported()) {
		TiReviewDialog.requestReview();
	}
}

function fetchData(args = {}) {
	if (!args.force) {
		$.placeholder.hide();
		loader.hide();
		loader.show();
	}

	$.window.title = L('loading');

	const api = require('api');
	api.getLunches({
		date: dateutils.currentDateSlug,
		location: Ti.App.Properties.getInt('currentLocationID', Alloy.CFG.defaultCanteen.id)
	}, function (e) {
		lunches = e;
		setUI();
		!args.force && loader.hide();
	});
}

function setUI() {
	$.refresh.endRefreshing();

	const showAdditives = Ti.App.Properties.getBool('showAdditives', true);
	const showRatings = Ti.App.Properties.getBool('showRatings', true);
	let sections = [];

	const categories = [
		L('Hauptgericht'),
		L('Beilagen'),
		L('Dessert'),
		L('Tagessalat'),
		L('Essen_Hochschulbedienstete', 'Essen Hochschulbedienstete'),
		L('Eintopf_Teller', 'Eintopf Teller')
	];

	cart.resetTotal(false);

	categories.forEach((category, index) => {
		const section = Alloy.createController('/lunches/section', {
			title: category,
			index: index
		}).getView();

		let cells = [];

		lunches.forEach(lunch => {
			if (L(lunch.category, lunch.category) !== category) {
				return;
			}

			const hasAdditives = lunch.additives && lunch.additives.length;
			const price = currentLunchState === LunchState.Student ? lunch.priceStudent.split(' €')[0] : lunch.priceOfficial.split(' €')[0];

			const attr = {
				itemId: lunch.id,
				count: 0,
				price: price,
				properties: {
					itemId: lunch.id,
					height: Ti.UI.SIZE,
					backgroundColor: '#fff',
					selectionStyle: (OS_IOS) ? Ti.UI.iOS.ListViewCellSelectionStyle.NONE : null,
				},
				buttonRemove: {
					visible: false
				},
				lunchTitle: {
					left: lunch.images.length > 0 ? 4 : 2,
					text: ((lunch.images.length ? '📷 ' : '') + lunch.name)
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
				attr['lunchAdditives'] = {
					text: formattedAdditives(hasAdditives ? lunch.additives.length : 0)
				};
			} else {
				attr['lunchAdditives'] = null;
			}

			if (showRatings) {
				attr['fullStars'] = {
					image: formattedStars(lunch.rating)
				};
				attr['scoreOfRating'] = {
					text: lunch.rating ? lunch.rating.value : 0
				};
				attr['numberOfRating'] = {
					text: lunch.rating ? lunch.rating.count : 0
				};
			} else {
				attr['fullStars'] = null;
				attr['scoreOfRating'] = null;
				attr['numberOfRating'] = null;
			}

			cells.push(attr);
		});
		section.setItems(cells);
		section.items.length > 0 && sections.push(section);
	});

	$.listView.sections = sections;
	$.window.setTitle(dateutils.formattedDate);
	$.placeholder[sections.length > 0 ? 'hide' : 'show']();

	promptForRating();
}

function formattedAdditives(count) {
	if (count === 0) {
		return L('no_additives');
	} else if (count === 1) {
		return L('one_additive');
	}
	return count + ' ' + L('additives');
}

function open() {
	if (OS_IOS) {
		nav.open();
	} else {
		$.window.open();
	}
}

function incrementPrice(e) {
	const item = e.section.getItemAt(e.itemIndex);

	item.count++;
	item.lunchCount.text = item.count;
	cart.increment(item.price);

	// First Increment
	if (item.count === 1) {
		item.buttonRemove.visible = true;
		item.lunchCountContainer.visible = true;
		item.lunchPriceContainer.backgroundImage = '/images/priceBgSelected.png';
		item.properties.backgroundColor = '#f3fdff';
	}

	e.section.updateItemAt(e.itemIndex, item);
	selectionChanged();
}

function decrementPrice(e) {
	const item = e.section.getItemAt(e.itemIndex);

	item.count--;
	item.lunchCount.text = item.count;
	cart.decrement(item.price);

	// Last Decrement
	if (item.count === 0) {
		item.buttonRemove.visible = false;
		item.lunchCountContainer.visible = false;
		item.lunchPriceContainer.backgroundImage = '/images/priceBg.png';
		item.properties.backgroundColor = '#fff';
	}

	e.section.updateItemAt(e.itemIndex, item);
	selectionChanged();
}

exports.open = open;
