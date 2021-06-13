export class Park {
    pk: string;
    sk: string;
    name: string;
    description: string;
    bcParksLink: string;
    status: string;
    visible: boolean;
    capacity: number;
    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.bcParksLink = obj && obj.bcParksLink || null;
        this.status = obj && obj.status || null;
        this.capacity = obj && obj.capacity || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
    }
}

export class PutPark {
    pk: string;
    sk: string;
    description: string;
    visible: boolean;
    park: ParkSubObject;
    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;
        this.park = obj && obj.park || null;
        this.description = obj && obj.description || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
    }
}

export class PostPark {
    description: string;
    visible: boolean;
    park: ParkSubObject;
    constructor(obj?: any) {
        this.park = obj && obj.park || null;
        this.description = obj && obj.description || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
    }
}

export class ParkSubObject {
    name: string;
    bcParksLink: string;
    status: string;
    capacity: number;

    constructor(obj?: any) {
        this.name = obj && obj.name || null;
        this.bcParksLink = obj && obj.bcParksLink || null;
        this.status = obj && obj.status || null;
        this.capacity = obj && obj.capacity || null;
    }
}
