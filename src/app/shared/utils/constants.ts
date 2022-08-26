export class Constants {
  public static readonly tableDefaults = {
    DEFAULT_CURRENT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 1000,
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

  public static readonly ApplicationRoles: any = {
    ADMIN: 'sysadmin'
  };

  public static readonly FacilityTypesList = [
    'Trail',
    'Parking'
  ];

  public static readonly weekdays = [
    {id: 0, name: 'Sunday', symbol: 'Su'},
    {id: 1, name: 'Monday', symbol: 'M'},
    {id: 2, name: 'Tuesday', symbol: 'T'},
    {id: 3, name: 'Wednesday', symbol: 'W'},
    {id: 4, name: 'Thursday', symbol: 'Th'},
    {id: 5, name: 'Friday', symbol: 'F'},
    {id: 6, name: 'Saturday', symbol: 'Sa'}
  ];

  public static readonly mockPass1 = {
    _id: 100,
    _schemaName: 'Pass',
    firstName: 'Frank',
    lastName: 'Sinatra',
    email: 'frank@gmail.com',
    registrationNumber: 'b289djd831',
    numberOfGuests: 3,
    facility: 10
  };

  public static readonly mockPass2 = {
    _id: 101,
    _schemaName: 'Pass',
    firstName: 'Lonely',
    lastName: 'Person',
    email: 'frank@gmail.com',
    registrationNumber: 'b289djd831',
    numberOfGuests: 1,
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
    passes: [100, 101],
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
    description: 'That is a pretty cool park you got there',
    facilities: [10, 11]
  };

  public static readonly mockPark2 = {
    _id: 2,
    _schemaName: 'Park',
    name: 'Alice Lake Provincial Park',
    status: 'open',
    description: 'Wow, nice park',
    facilities: []
  };

  public static readonly mockPassList = [
    { rowData: Constants.mockPass1 },
    { rowData: Constants.mockPass2 }
  ];

  public static readonly mockFacilityList = [
    { rowData: Constants.mockFacility1 },
    { rowData: Constants.mockFacility2 }
  ];

  public static readonly mockParkList = [
    { rowData: Constants.mockPark1 },
    { rowData: Constants.mockPark2 }
  ];

  public static readonly ToastTypes: any = {
    SUCCESS: 0,
    WARNING: 1,
    INFO: 2,
    ERROR: 3,
  };
}
