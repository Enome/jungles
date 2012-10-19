var services = require('./services');
var directives = require('./directives');
var controllers = require('./controllers');

var general = function (app) {
  app.factory('general', services);
  app.factory('_', function () { return require('underscore'); });
  app.directive('documentClick', directives.documentClick);
  app.controller('PageCtrl', controllers.PageCtrl);
};

module.exports = general;
