var factories = require('./factories');
var controllers = require('./controllers');

var alerts = function (app) {

  app.factory('alerts', factories);
  app.controller('AlertsCtrl', controllers.AlertsCtrl);

};

module.exports = alerts;
