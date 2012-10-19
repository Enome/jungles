var services = require('./services');

var events = function (app) {
  app.factory('events', services.events);
};

module.exports = events;
