var moment = require('alloy/moment'),
	date = moment(new Date());

function setToday(newDate) {
	date = newDate;
}

function getToday() {
	return moment(new Date()).format("DD.MM.YYYY");
}

exports = {

	setToday : setToday,

	getToday : getToday,
	
	getFormattedDate: function() {
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
	},

	increment : function() {
		var tomorrow = moment(date).add("day", 1);
		setToday(tomorrow);
	},

	decrement : function() {
		var yesterday = moment(date).subtract("day", 1);
		setToday(yesterday);
	},
	
	getCurrentDateSlug: function() {
		return date.format("YYYY-MM-DD");
	}
};
