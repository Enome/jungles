var factories = require('./factories');
var directives = require('./directives');
var controllers = require('./controllers');

var general = function (app) {
  app.directive('confirmClick', directives.confirmClick);
  app.directive('esckeypress', directives.esckeypress);
  app.factory('_', function () { return require('underscore'); });
  app.factory('general', factories);
  app.controller('PageCtrl', controllers.PageCtrl);
};

module.exports = general;
