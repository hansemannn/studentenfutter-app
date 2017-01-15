var moment = require('alloy/moment');
var date = moment(new Date());

/**
 * Public API
 */
exports.setToday = function(newDate) {
	date = newDate;
};

exports.getToday = function() {
	return moment(new Date()).format("DD.MM.YYYY");
};

exports.getFormattedDate = function() {
	var tomorrow = moment(new Date).add(1, "day");
	var yesterday = moment(new Date).subtract(1, "day");

	if (date.isSame(moment(new Date()), "day")) {
		return L("today") + ", " + date.format("DD.MM.YYYY");
	} else if (date.isSame(tomorrow, "day")) {
		return L("tomorrow") + ", " + date.format("DD.MM.YYYY");
	} else if (date.isSame(yesterday, "day")) {
		return L("yesterday") + ", " + date.format("DD.MM.YYYY");
	}
	
	return date.format("dd[, ]DD.MM.YYYY");
};

exports.increment = function() {
	exports.setToday(moment(date).add(1, "day"));
};

exports.decrement = function() {
	exports.setToday(moment(date).subtract(1, "day"));
};

exports.getCurrentDateSlug = function() {
	return date.format("YYYY-MM-DD");
};
