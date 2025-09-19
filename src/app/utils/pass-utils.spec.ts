import { PassUtils } from './pass-utils';

describe('PassUtils', () => {
  let originalClipboard: any;
  let writeTextSpy: jasmine.Spy;

  beforeAll(() => {
    // Mock navigator.clipboard
    originalClipboard = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard');
    const mockWriteText = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: mockWriteText
      },
      writable: true
    });
    writeTextSpy = mockWriteText;
  });

  afterAll(() => {
    if (originalClipboard) {
      Object.defineProperty(window.navigator, 'clipboard', originalClipboard);
    }
    // Note: We don't delete the property if it didn't exist originally
    // because Navigator.clipboard cannot be deleted in modern browsers
  });

  describe('exportToCsv', () => {
    let downloadSpy: jasmine.Spy;
    let createElementSpy: jasmine.Spy;
    let mockAnchor: any;

    beforeEach(() => {
      // Mock the download function by spying on DOM methods it uses
      mockAnchor = {
        href: '',
        download: '',
        click: jasmine.createSpy('click')
      };
      createElementSpy = spyOn(document, 'createElement').and.returnValue(mockAnchor);
      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock-url');
    });

    it('should export data to CSV with Parking facility type', () => {
      const data = [
        {
          passStatus: 'Active',
          registrationNumber: '12345',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          pk: 'pass::PARK1',
          facilityName: 'Lot A',
          date: '2024-06-01',
          type: 'AM',
          license: 'ABC123'
        }
      ];
      PassUtils.exportToCsv(data, 'Parking');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAnchor.download).toContain('bcparks-daypass-export-');
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should export data to CSV with non-Parking facility type', () => {
      const data = [
        {
          passStatus: 'Active',
          registrationNumber: '67890',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          pk: 'pass::PARK2',
          facilityName: 'Cabin 1',
          date: '2024-06-02',
          type: 'PM',
          numberOfGuests: 4
        }
      ];
      PassUtils.exportToCsv(data, 'Cabin');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAnchor.download).toContain('bcparks-daypass-export-');
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('copyEmailToClipboard', () => {
    it('should copy unique emails to clipboard', async () => {
      const data = [
        { email: 'a@example.com' },
        { email: 'b@example.com' },
        { email: 'a@example.com' }
      ];
      await PassUtils.copyEmailToClipboard(data);
      expect(writeTextSpy).toHaveBeenCalledWith('a@example.com; b@example.com');
    });

    it('should handle empty data', async () => {
      await PassUtils.copyEmailToClipboard([]);
      expect(writeTextSpy).toHaveBeenCalledWith('');
    });
  });
});