import utils from '/utils';
import LoaderInstance from '/loader';
import api from '/api';
import { ImageFactory } from 'ti.imagefactory';

const ListAction = {
	PerformRating: 'rating',
	ShowAdditives: 'additives'		
};

let nav;
let product;
let onRatingUpdated;

/**
 *  Constructor
 */
(function constructor(args) {
	product = args.product;
	onRatingUpdated = args.onRatingUpdated;
	
	if (OS_IOS) {
		nav = Ti.UI.iOS.createNavigationWindow({
			window: $.details
		});
	} else if (OS_ANDROID) {
        Alloy.Globals.setAndroidBackButton($.details);
    }
	
	setUI();
})(arguments[0] || {});

function setUI() {
	$.title.setText(product.name);
	
	setImages();
	setRating(product.rating);
	setAdditives();
}

function setImages() {
	const images = product.images || null;
	let views = [];
		
	if (!images || images.length === 0) {
		return;
	}
	
	$.placeholder.hide();
	
	// TODO: Move to Alloy-based generation
	let index = 0;
	images.forEach(function(image) {
		const _index = index;
		const view = Ti.UI.createView({
			left: 15,
			top: 10,
			height: 165,
			width: 165,
			borderRadius: 0,
			viewShadowRadius: 2,
			viewShadowColor: '#A6444444', // 65 %
			viewShadowOffset: {x: 0, y: 2}
		});
		
		const productImage = Ti.UI.createImageView({
			defaultImage: '/images/noImage.png',
			borderRadius: 0,
			image: image,
		});
		
		// Android currently doesn't support this due to TIMOB-24379
		OS_IOS && productImage.addEventListener('click', function(e) {
			openFullscreenImage(images, _index);
		});
		
		view.add(productImage);
		
		$.images.add(view);
		index++;
	});
	 	
	const label = Ti.UI.createLabel({
		text: '+ ',
		color: '#fff',
		opacity: 0.3,
		top: 40,
		left: 10,
		font: {
			fontSize: 80,
			fontWeight: 'bold'
		}
	});
	
	label.addEventListener('click', showCamera);	
		
	$.images.add(label);	
}

function openFullscreenImage(images, index) {
	Alloy.createController('/lunches/details/fullscreen', {
		images: images,
		currentIndex: index,
		title: product.name
	}).show();
}

function setRating(rating) {
	const section = $.list.sections[0];
	const ratingCell = section.items[0];

	ratingCell.rating.image = utils.formattedStars(rating);
	section.updateItemAt(0, ratingCell);
}

function setAdditives() {
	const section = $.list.sections[0];
	const additivesCell = section.items[1];
	const hasAdditives = product.additives && product.additives.length;
	
	if (!hasAdditives) {
		section.deleteItemsAt(1, 1);
		return;
	}
	
	additivesCell.additives.text = hasAdditives ? product.additives.length : '0';
	
	section.updateItemAt(1, additivesCell);
}

function close() {
    if (OS_IOS) {
        nav.close();
    } else {
        $.details.close();
    }
}

exports.open = function(animated) {
    if (OS_IOS) {
        nav.open({
					modal: animated, 
					modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
				});
    } else {
        $.details.open();
    }
};

function showCamera() {
	function _showCamera() {
		Ti.Media.showCamera({
			allowEditing : true,
			mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
			saveToPhotoGallery : false,
			success : function(e) {
				if (e.media) {
					sendProductImage(processImage(e.media));
				} else {
					showCameraError();
				}
			},
			error : showCameraError
		});
	}
	
	// Send red sqare on Simulator
	if (utils.isEmulator()) {
		sendGeneratedDemoImage();
		return;
	}
	
	if (!Ti.Media.hasCameraPermissions()) {
		Ti.Media.requestCameraPermissions(function(e) {
			if (e.success) {
				_showCamera();
			} else {
				showCameraError();
			}
		});
	} else {
		_showCamera();			
	}
}

function sendGeneratedDemoImage() {
	const dialog = Ti.UI.createAlertDialog({
		title: 'Simulator',
		message: 'You are currently running on the Simulator - without camera! We will generate a 1000x1000 red square now and try to send it to the server, do you really want to proceed?',
		buttonNames: ['Cancel', 'Proceed'],
		destructive: 1,
		cancel: 0
	});
	
	dialog.addEventListener('click', function(e) {
		if (e.index === 1) {
			sendProductImage(Ti.UI.createView({
				width: 1000,
				height: 1000,
				backgroundColor: 'red'
			}).toImage());
		}
	});
	
	dialog.show();
}

function sendProductImage(image) {
	loader = new LoaderInstance($.window);
	loader.show();

	api.postProductImage({
		'image[productId]': product.id,
		'image[userId]': Ti.Platform.getId(),
		'image[originalResource]': image
	}, function(e) {
		loader.hide();
		
		if (!e.awaitingModeration) {
			const title = L(e.feedbackTitle || 'upload_success', 'upload_success');
			const message = L(e.feedbackMessage || 'upload_success_msg', 'upload_success_msg');
			
			const dia = Ti.UI.createAlertDialog({
				title: title,
				message: message,
				buttonNames: [L('ok')]
			});
			dia.show();
		}
	}, function(e) {
		Ti.API.info('Process:' + e.value);
	});
}

function processImage(image) {
	if (OS_ANDROID) {
		return image.imageAsThumbnail(800);
	}

	const maxImageSize = 500000;
	const maxImageWidth = 1024;

	let outputImage = ImageFactory.compress(image, 0);
	
	Ti.API.debug('Image Size (before): ' + outputImage.length / 1000 + ' kb');

	if (outputImage.length > maxImageSize) {
		let newWidth;
		let newHeight;

		if (image.width > image.height) {
			// Querformat-Bilder auf eine Breite von 1024 fixieren
			newWidth = maxImageWidth;
			newHeight = image.height / image.width * newWidth;
		} else {
			// Hochformat-Bilder auf eine Höhe von 1024 fixieren
			newHeight = maxImageWidth;
			newWidth = image.width / image.height * newHeight;
		}

		outputImage = ImageFactory.imageAsResized(image, {
			width : newWidth,
			height : newHeight
		});

		if (outputImage.length > maxImageSize) {
			outputImage = ImageFactory.compress(image, 0);
		}		
	}
	
	Ti.API.debug('Image Size (after): ' + outputImage.length / 1000 + ' kb');

	return outputImage;
}

function showCameraError() {
	Ti.UI.createAlertDialog({
		title : L('warning'),
		message : L('camera_warning_text'),
		buttonNames : [L('all_right')]
	}).show();
}

function handleAction(e) {
	switch (e.itemId) {
		case ListAction.PerformRating:
			performRating();
		break;
		
		case ListAction.ShowAdditives:
			showAdditives();
		break;
	}
	
	OS_IOS && $.list.deselectItem(e.sectionIndex, e.itemIndex);
}

function performRating() {
	Alloy.createController('/lunches/details/ratingView', {
		parent: $.details,
		productId: product.id,
		onRatingUpdated: function(newRating) {
			setRating({value: newRating});
			onRatingUpdated();
		}
	}).show();
}

function showAdditives() {
	const usedAdditives = product.additives || [];
	
	if (usedAdditives === 0) {
		return;
	}
	
	try {
		const additives = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'json/additives.json').read());
		let result = [];
		
		_.map(additives, function(additive) {
			if (usedAdditives.indexOf(String(additive.id)) !== -1) {
				result.push(additive.name);
			}
		})
			
		// Some nice hack: Remove the last commata with an 'and'
		let message = result.join(', ');
		
		if (message.lastIndexOf(', ') !== -1) {
			message = setCharAt(message, message.lastIndexOf(', '), ' ' + L('and') + ' ');
		}
		
		$.alert.setMessage(message);
		$.alert.show();
	} catch(e) {
		Ti.API.error('No assets/json/additives.json available:'); 
		Ti.API.error(e);
	}	
}

// CREDITS: http://stackoverflow.com/a/1431110/5537752
function setCharAt(str,index,chr) {
    if (index > str.length - 1) {
		return str;
	}
	
    return str.substr(0, index) + chr + str.substr(index + 1);
}
