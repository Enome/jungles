var jungles = {

  auth: {
    persona: require('jungles-auth-persona'),
    simple: require('jungles-auth-simple'),
  },

  data: {
    postgres: require('jungles-data-postgres'),
    memory: require('jungles-data-memory'),
  },

  rest: require('jungles-rest'),
  panel: require('jungles-panel'),
  files: require('jungles-files'),
  types: require('jungles-types'),

  helpers: {
    frontend: require('jungles-helpers-frontend'),
  },

  middleware: {
    frontend: require('jungles-middleware-frontend'),
    general: require('jungles-middleware-general'),
  },

  errors: require('jungles-errors'),
  validators: require('jungles-validators'),
  validation: require('jungles-validation'),
  components: require('jungles-components'),
  functions: require('jungles-functions'),

};

module.exports = jungles;
