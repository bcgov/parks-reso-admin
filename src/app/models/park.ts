export class Park {
    pk: string;
    sk: string;
    name: string;
    description: string;
    bcParksLink: string;
    status: string;
    visible: boolean;
    constructor(obj?: any) {
        this.pk = obj && obj.pk || null;
        this.sk = obj && obj.sk || null;
        this.name = obj && obj.name || null;
        this.description = obj && obj.description || null;
        this.bcParksLink = obj && obj.bcParksLink || null;
        this.status = obj && obj.status || null;
        if (obj && typeof obj.visible === 'boolean') {
            this.visible = obj.visible;
        } else {
            this.visible = null;
        }
    }
}
