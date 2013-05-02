var factories = require('./factories');
var controllers = require('./controllers');

var header = function (app) {
  app.factory('header', factories);
  app.controller('HeaderCtrl', controllers.HeaderCtrl);
};

module.exports = header;
