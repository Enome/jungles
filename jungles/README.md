# Jungles - Content Management System

This module bundles all the other modules you need to setup Jungles.

```js
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

  helpers: {
    frontend: require('jungles-helpers-frontend'),
  },

  middleware: {
    frontend: require('jungles-middleware-frontend'),
  },

  errors: require('jungles-errors'),

};
```
