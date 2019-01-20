import api from 'api';

let parent;
let productId;
let rating;
let onRatingUpdated;

/**
 *  Constructor
 */
(function constructor(args) {
	parent = args.parent;
	productId = args.productId;
	onRatingUpdated = args.onRatingUpdated;

	generateRatingUI();
}(arguments[0] || {}));

function setRating(e) {
	rating = e.source.userData ? e.source.userData.value : null;

	if (!rating) {
		return;
	}

	// TODO: Find smarter way for this midnight hacking!

	for (let i = 1; i <= rating; i++) {
		$.rating.children[i - 1].setImage('/images/icons/singleStarFull.png');
	}

	if (rating < 5) {
		for (let i = rating + 1; i <= 5; i++) {
			$.rating.children[i - 1].setImage('/images/icons/singleStarEmpty.png');
		}
	}

	$.submit.enabled = true;
}

function submitRating() {
	if (!rating) {
		Ti.API.error('State error: Should have selected at least 1 at this point!');
		return;
	}

	$.innerContent.hide();
	$.loader.visible = true;
	$.loader.show();

	api.postRating({
		productId: productId,
		userId: Ti.Platform.id,
		rating: rating
	}, (e) => {
		if (!e.success) {
			Ti.UI.createAlertDialog({
				title: L('rating_error'),
				message: L('already_voted') + '\uE00E',
				buttonNames: [ L('ok') ]
			}).show();
		} else {
			onRatingUpdated(rating);
		}

		$.loader.hide();
		hide();
	});
}

function hide() {
	$.container.animate({
		opacity: 0,
		duration: 500
	}, () => {
		parent.remove($.container);
	});
}

function generateRatingUI() {
	for (let i = 1; i <= 5; i++) {
		$.rating.add(Ti.UI.createImageView({
			image: '/images/icons/singleStarEmpty.png',
			userData: {
				value: i
			},
			height: 30,
			width: 30
		}));
	}
}

exports.show = function () {
	parent.add($.container);

	$.container.animate({
		opacity: 1,
		duration: 500
	});

	$.content.animate({
		height: 135,
		duration: 500
	});
};
