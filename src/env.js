(function (window) {
  window.__env = window.__env || {};

  // Ideally in our app we have a wrapper around our logger class in the angular front ends to
  // turn on/off the console.log's
  window.__env.debugMode = true;

  // Environment name
  window.__env.ENVIRONMENT = 'test';  // local | dev | test | prod
  window.__env.API_LOCATION = ' https://p41gitzo3l.execute-api.ca-central-1.amazonaws.com';
  window.__env.API_PATH = '/test';
  window.__env.KEYCLOAK_CLIENT_ID = 'nrpti-admin';
  window.__env.KEYCLOAK_URL = 'https://oidc.gov.bc.ca/auth';
  window.__env.KEYCLOAK_REALM = '3l5nw6dk';
  window.__env.KEYCLOAK_ENABLED = true;

  // Add any feature-toggles
  // window.__env.coolFeatureActive = false;
}(this));