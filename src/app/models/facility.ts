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
    }
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

        this.bookingOpeningHour = obj && obj.bookingOpeningHour || null;
        this.bookingDaysAhead = obj && obj.bookingDaysAhead || null;
    }
}
