export class MockData {
  // For .spec tests

  public static readonly mockPark_1 = {
    pk: 'park',
    sk: 'Mock Park 1',
    bcParksLink: 'https://bcparks.ca',
    description: 'Mock Park 1 description',
    mapLink: 'https://bcparks.ca',
    name: 'Mock Park 1',
    orcs: 'MOCK',
    roles: ['sysadmin', 'MOCK'],
    status: 'open',
    visible: true,
    winterWarning: false,
  };

  public static readonly mockFacility_1 = {
    bookingDays: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: true,
      Friday: true,
      Saturday: true,
      Sunday: true,
    },
    isUpdating: false,
    bookingDaysAhead: 2,
    visible: true,
    bookingOpeningHour: 7,
    status: {
      stateReason: null,
      state: 'open',
    },
    bookableHolidays: [],
    name: 'Mock Facility 1',
    bookingDaysRichText: '<p>Rich text for Mock Facility 1</p>',
    bookingTimes: {
      AM: {
        max: 5,
      },
      PM: {
        max: 3,
      },
    },
    sk: 'Mock Facility 1',
    pk: 'facility::Mock Park 1',
    type: 'Trail',
  };

  public static readonly mockPartialPassFilters_1 = {
    passType: 'Trail',
    passStatus: 'reserved',
  };

  public static readonly mockFullPassFilters_1 = {
    passType: 'Trail',
    date: '2022-12-19',
    passStatus: 'reserved',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'mock@email.ca',
    reservationNumber: '1234567890',
  };

  public static readonly mockPass_1 = {
    pk: 'pass::Mock Park 1',
    sk: '1234567890',
    creationDate: '2022-12-18T19:00:00.000Z',
    date: '2022-12-18T19:00:00.000Z',
    email: 'mock@email.ca',
    facilityName: 'Mock Facility 1',
    facilityType: 'Trail',
    firstName: 'FirstName',
    lastName: 'LastName',
    searchFirstName: 'firstName',
    searchLastName: 'lastName',
    isOverbooked: false,
    numberOfGuests: 4,
    passStatus: 'expired',
    phoneNumber: null,
    registrationNumber: '1234567890',
    shortPassDate: '2022-12-18',
    type: 'PM',
  };

  public static readonly mockPass_2 = {
    pk: 'pass::Mock Park 1',
    sk: '1234567891',
    creationDate: '2022-12-18T19:00:00.000Z',
    date: '2022-12-18T19:00:00.000Z',
    email: 'mock2@email.ca',
    facilityName: 'Mock Facility 1',
    facilityType: 'Trail',
    firstName: 'FirstName2',
    lastName: 'LastName2',
    searchFirstName: 'firstName2',
    searchLastName: 'lastName2',
    isOverbooked: false,
    numberOfGuests: 2,
    passStatus: 'reserved',
    phoneNumber: 1111111111,
    registrationNumber: '1234567891',
    shortPassDate: '2022-12-18',
    type: 'PM',
  };
}
