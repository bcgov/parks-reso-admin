export class Constants {
  public static readonly dataIds = {
    PARK_AND_FACILITY_LIST: 'parksFaciltiyList',
    PARKS_LIST: 'parksList',
    CURRENT_PARK: 'currentPark',
    FACILITIES_LIST: 'facilitiesList',
    CURRENT_FACILITY: 'currentFacility',
    PASSES_LIST: 'passesList',
    PASS_SEARCH_PARAMS: 'passSearchParams',
    PASS_LAST_EVALUATED_KEY: 'passLastEvaluatedKey',
    CANCELLED_PASS: 'cancelledPass',
    RESERVATION_OBJECTS_LIST: 'reservationObjectsList',
    CURRENT_RESERVATIONS_OBJECT: 'currentReservationsObj',
    CURRENT_CAPACITY_BAR_OBJECT: 'currentCapacityBarObj',
    ENTER_DATA_URL_PARAMS: 'enter-data-url-params',
    PASS_BREAKDOWN_BY_STATUS: 'pass-breakdown-by-status',
    PASS_CHECK_IN_LIST: 'pass-check-in-list',
    PASS_CHECK_IN_LIST_EVENT: 'pass-check-in-list-event',
    MODIFIERS: 'modifiers',
    METRICS_FILTERS_PARAMS: 'metrics-filters-params',
    CURRENT_METRICS: 'metrics-cache',
    PASS_LOOKUP_PARK_SELECT_CACHE: 'passLookupParkSelectCache',
    PASS_LOOKUP_FACILITY_SELECT_CACHE: 'passLookupFacilitySelectCache',
  };

  public static readonly ToastTypes: any = {
    SUCCESS: 0,
    WARNING: 1,
    INFO: 2,
    ERROR: 3,
  };

  // luxon weekdays, 1-indexed starting with Monday.
  public static readonly Weekdays: any[] = [
    { id: 7, name: 'Sunday', symbol: 'Su' },
    { id: 1, name: 'Monday', symbol: 'M' },
    { id: 2, name: 'Tuesday', symbol: 'T' },
    { id: 3, name: 'Wednesday', symbol: 'W' },
    { id: 4, name: 'Thursday', symbol: 'Th' },
    { id: 5, name: 'Friday', symbol: 'F' },
    { id: 6, name: 'Saturday', symbol: 'Sa' },
  ];

  public static readonly stateLabelDictionary = {
    active: {
      state: 'active',
      headerBSBackgroundThemeColour: 'bg-success',
      headerText: 'Pass Active',
      headerIcon: 'bi bi-check-lg',
      headerTextColour: 'text-white',
      bodyBSBackgroundColour: 'bg-white',
      bodyTextColour: 'text-black',
      passStatusTextColour: 'text-success',
      statusText: 'Active',
      submitButtonHidden: false,
      submitButtonBSThemeColour: 'btn-success',
      submitButtonText: 'Check-in',
    },
    reserved: {
      state: 'reserved',
      headerBSBackgroundThemeColour: 'bg-warning',
      headerText: 'Pass Reserved',
      headerIcon: 'bi bi-exclamation-triangle-fill',
      headerTextColour: 'text-black',
      bodyBSBackgroundColour: 'bg-white',
      bodyTextColour: 'text-black',
      passStatusTextColour: 'text-warning',
      statusText: 'Reserved',
      warningText: 'This pass is for a later timeslot!',
      submitButtonHidden: false,
      submitButtonBSThemeColour: 'btn-warning',
      submitButtonText: 'Check-in',
    },
    reservedFuture: {
      state: 'reserved',
      headerBSBackgroundThemeColour: 'bg-warning',
      headerText: 'Pass Reserved',
      headerIcon: 'bi bi-exclamation-triangle-fill',
      headerTextColour: 'text-black',
      bodyBSBackgroundColour: 'bg-white',
      bodyTextColour: 'text-black',
      passStatusTextColour: 'text-warning',
      statusText: 'Reserved',
      warningText: 'This is for a future date!',
      submitButtonHidden: true,
      submitButtonBSThemeColour: 'btn-warning',
      submitButtonText: 'Check-in',
    },
    expired: {
      state: 'expired',
      headerBSBackgroundThemeColour: 'bg-danger',
      headerText: 'Pass Expired',
      headerIcon: 'bi bi-x-lg',
      headerTextColour: 'text-white',
      bodyBSBackgroundColour: 'bg-white',
      bodyTextColour: 'text-black',
      passStatusTextColour: 'text-danger',
      statusText: 'Expired',
      submitButtonHidden: true,
      submitButtonBSThemeColour: 'btn-secondary',
      submitButtonText: 'Check-in',
    },
    cancelled: {
      state: 'cancelled',
      headerBSBackgroundThemeColour: 'bg-danger',
      headerText: 'Pass Cancelled',
      headerIcon: 'bi bi-x-lg',
      headerTextColour: 'text-white',
      bodyBSBackgroundColour: 'bg-white',
      bodyTextColour: 'text-black',
      passStatusTextColour: 'text-danger',
      statusText: 'Cancelled',
      submitButtonHidden: true,
      submitButtonBSThemeColour: 'btn-secondary',
      submitButtonText: 'Check-in',
    },
    checkedIn: {
      state: 'checkedIn',
      headerBSBackgroundThemeColour: 'bg-success',
      headerText: 'Checked-in',
      headerIcon: 'bi bi-check2-all',
      headerTextColour: 'text-white',
      bodyBSBackgroundColour: 'bg-success',
      bodyTextColour: 'text-white',
      passStatusTextColour: 'text-white',
      statusText: 'Checked-in',
      submitButtonHidden: false,
      submitButtonBSThemeColour: 'btn-outline-success',
      submitButtonText: 'Check-out',
    },
  };
}
