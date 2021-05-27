export class Constants {
  public static readonly tableDefaults = {
    DEFAULT_CURRENT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_SORT_BY: '-datePosted',
    DEFAULT_KEYWORDS: '',
    DEFAULT_SHOW_MORE_INCREMENT: 5,
    DEFAULT_DATASET: '',
    DEFAULT_PAGE_SIZE_OPTIONS: [
      { displayText: '10', value: 10 },
      { displayText: '25', value: 25 },
      { displayText: '50', value: 50 },
      { displayText: '100', value: 100 }
    ]
  };

  public static readonly mockPass1 = {
    _id: 100,
    _schemaName: 'Pass',
    firstName: 'Frank',
    lastName: 'Sinatra',
    email: 'frank@gmail.com',
    confirmationNumber: 'b289djd831',
    numberOfGuests: 3,
    facility: 10
  };

  public static readonly mockFacility1 = {
    _id: 10,
    _schemaName: 'Facility',
    name: 'Goldstream Trail',
    type: 'trail',
    time: 'AM',
    capacity: 400,
    status: 'open',
    passes: [100],
    park: 1
  };

  public static readonly mockFacility2 = {
    _id: 11,
    _schemaName: 'Facility',
    name: 'Goldstream Parking Lot',
    type: 'parking',
    time: 'AM',
    capacity: 100,
    status: 'open',
    passes: [],
    park: 1
  };

  public static readonly mockPark1 = {
    _id: 1,
    _schemaName: 'Park',
    name: 'Goldstream',
    status: 'open',
    facilities: [10, 11]
  };

  public static readonly mockPark2 = {
    _id: 2,
    _schemaName: 'Park',
    name: 'Alice Lake Provincial Park',
    status: 'open',
    facilities: []
  };

  public static readonly mockParkList = [
    { rowData: Constants.mockPark1 },
    { rowData: Constants.mockPark2 }
  ];

}
