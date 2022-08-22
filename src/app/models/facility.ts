export class Facility {
    pk: string;
    sk: string;

    name: string;
    status: object;
    type: string;
    visible: boolean;
    bookingTimes: any;

    bookingOpeningHour: number;
    bookingDaysAhead: number;

    bookingDays: object;
    bookingDaysRichText: string;
    bookableHolidays: string[];

    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;

        this.name = obj && obj.name || null;
        this.status = obj && obj.status || null;
        this.type = obj && obj.type || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
        this.bookingTimes = obj && obj.bookingTimes || {};
        this.status = obj && obj.status || {};

        this.bookingOpeningHour = obj && obj.bookingOpeningHour || null;
        this.bookingDaysAhead = obj && obj.bookingDaysAhead || null;

        this.bookingDays = obj && obj.bookingDays || defaultBookingDays();
        this.bookingDaysRichText = obj && obj.bookingDaysRichText || '';
        this.bookableHolidays = obj && obj.bookableHolidays || [];
    }
}

function defaultBookingDays() {
  return {
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true
  };
}

export class PostFacility {
    name: string;
    status: object;
    type: string;
    visible: boolean;
    bookingTimes: any;
    parkName: string;

    bookingOpeningHour: number;
    bookingDaysAhead: number;

    bookingDays: object;
    bookingDaysRichText: string;
    bookableHolidays: string[];

    constructor(obj?: any) {
        this.name = obj && obj.name || null;
        this.status = obj && obj.status || null;
        this.type = obj && obj.type || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
        this.bookingTimes = obj && obj.bookingTimes || {};
        this.status = obj && obj.status || {};
        this.parkName = obj && obj.parkName || null;

        this.bookingOpeningHour = obj && obj.bookingOpeningHour || null;
        this.bookingDaysAhead = obj && obj.bookingDaysAhead || null;

        this.bookingDays = obj && obj.bookingDays || defaultBookingDays();
        this.bookingDaysRichText = obj && obj.bookingDaysRichText || '';
        this.bookableHolidays = obj && obj.bookableHolidays || [];
    }
}

export class PutFacility {
    pk: string;
    sk: string;

    name: string;
    status: object;
    type: string;
    visible: boolean;
    bookingTimes: any;

    parkName: string;

    bookingOpeningHour: number;
    bookingDaysAhead: number;

    bookingDays: object;
    bookingDaysRichText: string;
    bookableHolidays: string[];

    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;

        this.name = obj && obj.name || null;
        this.status = obj && obj.status || null;
        this.type = obj && obj.type || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
        this.bookingTimes = obj && obj.bookingTimes || {};
        this.status = obj && obj.status || {};
        this.parkName = obj && obj.parkName || null;

        if (obj && (obj.bookingOpeningHour || obj.bookingOpeningHour === 0)) {
            this.bookingOpeningHour = obj.bookingOpeningHour;
        } else {
            this.bookingOpeningHour = null;
        }
        if (obj && (obj.bookingDaysAhead || obj.bookingDaysAhead === 0)) {
            this.bookingDaysAhead = obj.bookingDaysAhead;
        } else {
            this.bookingDaysAhead = null;
        }

        this.bookingDays = obj && obj.bookingDays || defaultBookingDays();
        this.bookingDaysRichText = obj && obj.bookingDaysRichText || '';
        this.bookableHolidays = obj && obj.bookableHolidays || [];
    }
}
