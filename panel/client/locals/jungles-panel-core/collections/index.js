var services = require('./services');

var collections = function (app) {
  app.factory('collections', services);
};

module.exports = collections;
