var controllers = require('./controllers');
var factories = require('./factories');

var types = function (app) {
  app.factory('types', factories);
  app.controller('TypesCtrl', controllers.TypesCtrl);
};

module.exports = types;
