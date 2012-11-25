var controllers = require('./controllers');

var alerts = function (app) {

  app.controller('AlertsCtrl', controllers.AlertsCtrl);

};

module.exports = alerts;
