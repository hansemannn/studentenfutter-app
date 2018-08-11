let onSettingsUpdated;

/**
 *  Constructor
 */
(function constructor() {
	$.amount.setText(`${L('total_amount')}: 0.00 €`);
	$.location.setText(Ti.App.Properties.getString('currentLocationName', Alloy.CFG.defaultCanteen.title));
}(arguments[0] || {}));

function openSettings() {
	Alloy.createController('/settings/index', {
		onSettingsUpdated: (e) => {
			switch (e.action) {
				case 'selectCanteen':
					$.location.setText(e.title);
					break;
			}
			onSettingsUpdated(e);
		}
	}).open();
}

function resetAmount() {
	Alloy.Models.cart.resetTotal(true);
}

exports.onSettingsUpdated = function (_onSettingsUpdated) {
	onSettingsUpdated = _onSettingsUpdated;
};

exports.updateTotalSummary = function (_summary) {
	$.amount.setText(`${L('total_amount')}: ${_summary}`);
};

exports.updateCurrentCanteen = function (_text) {
	$.location.setText(_text);
};
