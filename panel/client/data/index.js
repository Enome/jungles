var services = require('./services');

var data = function (app) {
  app.factory('instances', services.instances);
  app.factory('types', services.types);
};

module.exports = data;
