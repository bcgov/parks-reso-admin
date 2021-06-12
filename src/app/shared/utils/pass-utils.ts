export class PassUtils {

    static exportToCsv(data: any[]): void {
        // TODO: format to match pass schema when finalized
        const csvHeaders = [
            'Pass Status',
            'Reservation Number',
            'First Name',
            'Last Name',
            'Email',
            'Park',
            'Facility',
            'Date',
            'Time',
            'Number of Guests',
        ];

        let output = '';
        output = `${csvHeaders.join(',')}\n`;

        for (const row of data) {
            let line = [];
            line.push(escapeCsvString(row.rowData['passStatus']));
            line.push(escapeCsvString(row.rowData['registrationNumber']));
            line.push(escapeCsvString(row.rowData['firstName']));
            line.push(escapeCsvString(row.rowData['lastName']));
            line.push(escapeCsvString(row.rowData['email']));
            if (row.rowData['pk']) {
                line.push(escapeCsvString(row.rowData['pk'].slice(5)));
            }
            line.push(escapeCsvString(row.rowData['facilityName']));
            line.push(escapeCsvString(row.rowData['date']));
            line.push(escapeCsvString(row.rowData['type']));
            line.push(escapeCsvString(row.rowData['numberOfGuests']));

            output += `${line.join(',')}\n`;
        }
        let today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
        download(`bcparks-daypass-export-${today}.csv`, output);
    }
}

function escapeCsvString(csvField: any): string {
    if (!csvField) {
        return '';
    }
    let str = csvField.toString();
    // Replace newline chars
    str = str.replace(/(?:\r\n|\r|\n)/g, '');
    // Escape quotes
    str = str.replace(/\"/g, '""');
    // Escape commas
    if (str.indexOf(',') > -1) {
        str = `"${str}"`;
    }
    return str;
}

function download(filename: string, text: string): void {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}
