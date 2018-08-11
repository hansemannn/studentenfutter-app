import format from 'date-fns/format';

const ONE_DAY = 86400000;

export default class DateUtils {
	constructor() {
		try {
			this.lang = require('date-fns/locale/' + Ti.Locale.currentLanguage);
		} catch (e) {
			this.lang = 'de';
		}

		this.days = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];
		this.date = new Date();
	}

	set today(newDate) {
		this.date = newDate;
	}

	get today() {
		return this.localeDateString(new Date());
	}

	get formattedDate() {

		const tomorrow = this.addedDate(new Date());
		const yesterday = this.substractedDate(new Date());

		if (this.isSameDay(this.date, new Date())) {
			return L('today') + ', ' + this.localeDateString(this.date);
		} else if (this.isSameDay(this.date, tomorrow)) {
			return L('tomorrow') + ', ' + this.localeDateString(this.date);
		} else if (this.isSameDay(this.date, yesterday)) {
			return L('yesterday') + ', ' + this.localeDateString(this.date);
		}

		return `${format(this.date, 'dddd', { locale: this.lang })}, ${this.localeDateString(this.date)}`;
	}

	localeDateString(date) {
		return format(date, 'DD.MM.YYYY', { locale: this.lang });
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
