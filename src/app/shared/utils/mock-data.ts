export class MockData {
  // For .spec tests
  public static readonly mockPark_1 = {
    pk: 'park',
    sk: 'MOC1',
    bcParksLink: 'https://bcparks.ca',
    description: 'Mock Park 1 description',
    mapLink: 'https://bcparks.ca',
    name: 'Mock Park 1',
    orcs: 'MOC1',
    roles: ['sysadmin', 'MOC1'],
    status: 'open',
    visible: true,
    capacity: null,
    winterWarning: false,
  };

  public static readonly mockPark_2 = {
    pk: 'park',
    sk: 'MOC2',
    bcParksLink: 'https://bcparks.ca',
    description: 'Mock Park 2 description',
    mapLink: 'https://bcparks.ca',
    name: 'Mock Park 2',
    orcs: 'MOC2',
    roles: ['sysadmin', 'MOC2'],
    status: 'closed',
    visible: false,
    capacity: 100,
    winterWarning: true,
  };

  public static readonly mockFacility_1 = {
    bookingDays: {
      1: false,
      2: false,
      3: false,
      4: true,
      5: true,
      6: true,
      7: true,
    },
    isUpdating: false,
    bookingDaysAhead: 2,
    visible: true,
    qrcode: false,
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
    pk: 'facility::MOC1',
    type: 'Trail',
  };

  // closed, invisible
  public static readonly mockFacility_2 = {
    bookingDays: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    },
    isUpdating: false,
    bookingDaysAhead: 0,
    visible: false,
    bookingOpeningHour: null,
    status: {
      stateReason: 'Closed reason',
      state: 'closed',
    },
    bookableHolidays: [],
    name: 'Mock Facility 2',
    bookingDaysRichText: '<p>Rich text for Mock Facility 2</p>',
    bookingTimes: {
      DAY: {
        max: 7,
      },
    },
    sk: 'Mock Facility 2',
    pk: 'facility::MOC1',
    type: 'Parking',
  };

  public static readonly mockFacility_3 = {
    bookingDays: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    },
    isUpdating: false,
    bookingDaysAhead: 0,
    visible: false,
    bookingOpeningHour: null,
    status: {
      stateReason: 'Closed reason',
      state: 'closed',
    },
    bookableHolidays: [],
    name: 'Mock Facility 3',
    bookingDaysRichText: '<p>Rich text for Mock Facility 3</p>',
    bookingTimes: {
      DAY: {
        max: 7,
      },
    },
    sk: 'Mock Facility 3',
    pk: 'facility::MOC2',
    type: 'Parking',
  };

  public static readonly mockPartialPassFilters_1 = {
    passType: 'AM',
    facilityName: 'Mock Facility 1',
    park: 'MOC1'
  };

  public static readonly mockFullPassFilters_1 = {
    passType: 'AM',
    date: '2022-12-19',
    passStatus: 'reserved',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'mock@email.ca',
    reservationNumber: '1234567890',
    park: 'MOC1',
    facilityName: 'Mock Facility 1'
  };

  public static readonly mockPass_1 = {
    pk: 'pass::MOC1',
    sk: '1234567890',
    parkName: 'Mock Park 1',
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
    pk: 'pass::MOC1',
    sk: '1234567891',
    parkName: 'Mock Park 1',
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

  public static readonly mockReservationObj_1 = {
    pk: 'reservations::MOC1::Mock Facility 1',
    sk: '2022-12-21',
    status: 'open',
    capacities: {
      AM: {
        baseCapacity: 5,
        capacityModifier: 8,
        availablePasses: 13,
        overbooked: 0,
      },
      PM: {
        baseCapacity: 3,
        capacityModifier: -1,
        availablePasses: 0,
        overbooked: 1,
      },
    },
  };

  public static readonly mockReservationObj_2 = {
    pk: 'reservations::MOC1::Mock Facility 1',
    sk: '2022-12-22',
    status: 'closed',
    capacities: {
      AM: {
        baseCapacity: 5,
        capacityModifier: 0,
        availablePasses: 5,
        overbooked: 0,
      },
      PM: {
        baseCapacity: 3,
        capacityModifier: -1,
        availablePasses: 2,
        overbooked: 1,
      },
    },
  };

  public static readonly mockPassLastEvaluatedKey_1 = {
    pk: {
      S: 'pk',
    },
    sk: {
      S: 'sk',
    },
  };

  public;

  public static readonly mockParkFacility_1 = {
    MOC1: {
      ...this.mockPark_1,
      ...{
        facilities: {
          'Mock Facility 1': this.mockFacility_1,
          'Mock Facility 2': this.mockFacility_2,
        },
      },
    },
    MOC2: {
      ...this.mockPark_2,
      ...{
        facilities: { 'Mock Facility 3': this.mockFacility_3 },
      },
    },
  };

  public static readonly metricsData1 = {
    'active': 2,
    'reserved': 30,
    'cancelled': 400,
    'expired': 5000
  }

  public static readonly metricsData2 = {
    'active': 1,
    'reserved': 20,
    'cancelled': 300,
    'expired': 4000
  }

  public static readonly mockMetrics1 = {
    lastUpdated: '2023-03-28T10:09:37.713-07:00',
    sk: '2023-01-31',
    cancelled: 0,
    capacities: {
      AM: {
        baseCapacity: 14,
        capacityModifier: 0,
        checkedIn: 5,
        passStatuses: {
          active: 5,
          reserved: 3,
          expired: 1,
          cancelled: 4,
        },
        availablePasses: 5,
        overbooked: 0
      },
      PM: {
        baseCapacity: 10,
        capacityModifier: 0,
        checkedIn: 0,
        passStatuses: {},
        availablePasses: 10,
        overbooked: 0
      }
    },
    pk: 'metrics::MOC1::Mock Facility 1',
    totalPasses: 9,
    fullyBooked: false,
    hourlyData: [
      {
        hour: 0,
        checkedIn: 0
      },
      {
        hour: 1,
        checkedIn: 0
      },
      {
        hour: 2,
        checkedIn: 0
      },
      {
        hour: 3,
        checkedIn: 0
      },
      {
        hour: 4,
        checkedIn: 0
      },
      {
        hour: 5,
        checkedIn: 0
      },
      {
        hour: 6,
        checkedIn: 0
      },
      {
        hour: 7,
        checkedIn: 0
      },
      {
        hour: 8,
        checkedIn: 0
      },
      {
        hour: 9,
        checkedIn: 5
      },
      {
        hour: 10,
        checkedIn: 0
      },
      {
        hour: 11,
        checkedIn: 0
      },
      {
        hour: 12,
        checkedIn: 0
      },
      {
        hour: 13,
        checkedIn: 0
      },
      {
        hour: 14,
        checkedIn: 0
      },
      {
        hour: 15,
        checkedIn: 0
      },
      {
        hour: 16,
        checkedIn: 0
      },
      {
        hour: 17,
        checkedIn: 0
      },
      {
        hour: 18,
        checkedIn: 0
      },
      {
        hour: 19,
        checkedIn: 0
      },
      {
        hour: 20,
        checkedIn: 0
      },
      {
        hour: 21,
        checkedIn: 0
      },
      {
        hour: 22,
        checkedIn: 0
      },
      {
        hour: 23,
        checkedIn: 0
      }
    ]
  }
}
