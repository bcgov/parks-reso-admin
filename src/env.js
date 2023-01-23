(function (window) {
  window.__env = window.__env || {};

  window.__env.logLevel = 0; // All

  // Get config from remote host?
  window.__env.configEndpoint = false;

  // Environment name
  window.__env.ENVIRONMENT = "local"; // local | dev | test | prod

  window.__env.API_LOCATION = "http://localhost:3000";
  window.__env.API_PATH = "/api";
  window.__env.KEYCLOAK_CLIENT_ID = "parking-pass";
  window.__env.KEYCLOAK_URL = "https://dev.loginproxy.gov.bc.ca/auth";
  window.__env.KEYCLOAK_REALM = "bcparks-service-transformation";
  window.__env.KEYCLOAK_ENABLED = true;

  // Number of days in advance a pass is available
  window.__env.ADVANCE_BOOKING_LIMIT = 3;

  // Hour of day that booking limit advances by 1 day
  window.__env.ADVANCE_BOOKING_HOUR = 7;

  // QR Codes
  window.__env.QR_CODE_ENABLED = true;

  // Add any feature-toggles
  // window.__env.coolFeatureActive = false;
})(this);
