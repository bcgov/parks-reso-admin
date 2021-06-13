export class Facility {
    pk: string;
    sk: string;
    name: string;
    bcParksLink: string;
    status: object;
    type: string;
    visible: boolean;
    bookingTimes: Object;
    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;
        this.name = obj && obj.name || null;
        this.bcParksLink = obj && obj.bcParksLink || null;
        this.status = obj && obj.status || null;
        this.type = obj && obj.type || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
        this.bookingTimes = obj && obj.bookingTimes || {};
        this.status = obj && obj.status || {};
    }
}
