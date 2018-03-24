const ONE_DAY = 86400000;

export default class DateUtils {
	constructor() {
		this.days = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
		this.date = new Date();
		this.currentLanguage = Ti.Locale.getCurrentLanguage();
	}

	set today(newDate) {
		this.date = newDate;
	}

	get today() {
		return new Date().toLocaleDateString();
	}

	get formattedDate() {
		const tomorrow = this.addedDate(new Date());
		const yesterday = this.substractedDate(new Date());

		if (this.isSameDay(this.date, new Date())) {
			return L('today') + ', ' + this.date.toLocaleDateString();
		} else if (this.isSameDay(this.date, tomorrow)) {
			return L('tomorrow') + ', ' + this.date.toLocaleDateString();
		} else if (this.isSameDay(this.date, yesterday)) {
			return L('yesterday') + ', ' + this.date.toLocaleDateString();
		}

		return `${L(this.days[this.date.getDay()])}, ${this.date.toLocaleDateString()}`;
	}

	isSameDay(date1, date2) {
		return date1.toDateString() === date2.toDateString();
	}

	get currentDateSlug() {
	    const d = new Date(this.date);
	    const year = d.getFullYear();
		let month = '' + (d.getMonth() + 1);
	    let day = '' + d.getDate();

	    if (month.length < 2) {
			month = '0' + month;
		}

	    if (day.length < 2) {
			day = '0' + day;
		}

	    return [ year, month, day ].join('-');
	}

	increment() {
		this.date = this.addedDate(this.date);
	}

	decrement() {
		this.date = this.substractedDate(this.date);
	}

	addedDate(_date) {
		return new Date(_date.getTime() + ONE_DAY);
	}

	substractedDate(_date) {
		return new Date(_date.getTime() - ONE_DAY);
	}
}
