import { Pass } from '../models/pass.model';

export class PassUtils {
  static exportToCsv(data: any[], facilityType): void {
    // TODO: format to match pass schema when finalized
    let csvHeaders = [
      'Pass Status',
      'Reservation Number',
      'First Name',
      'Last Name',
      'Email',
      'Park',
      'Facility',
      'Date',
      'Time',
    ];

    if (facilityType === 'Parking') {
      csvHeaders.push('License');
    } else {
      csvHeaders.push('Guests');
    }

    let output = '';
    output = `${csvHeaders.join(',')}\n`;
    for (const row of data) {
      const pass = new Pass(row);
      let line = [];
      line.push(escapeCsvString(pass.passStatus));
      line.push(escapeCsvString(pass.registrationNumber));
      line.push(escapeCsvString(pass.firstName));
      line.push(escapeCsvString(pass.lastName));
      line.push(escapeCsvString(pass.email));
      line.push(escapeCsvString(pass.pk.replace('pass::', '')));
      line.push(escapeCsvString(pass.facilityName));
      line.push(escapeCsvString(pass.date));
      line.push(escapeCsvString(pass.type));

      if (facilityType === 'Parking') {
        line.push(escapeCsvString(pass.license));
      } else {
        line.push(escapeCsvString(pass.numberOfGuests));
      }

      output += `${line.join(',')}\n`;
    }
    let today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
    download(`bcparks-daypass-export-${today}.csv`, output);
  }

  static copyEmailToClipboard(data: any[]) {
    const emails = new Set();

    for (const row of data) {
      const pass = new Pass(row);
      emails.add(pass.email);
    }

    return navigator.clipboard.writeText(Array.from(emails).join('; '));
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
