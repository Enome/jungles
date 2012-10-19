var controllers = require('./controllers');

var errors = function (app) {

  app.controller('ErrorCtrl', controllers.ErrorCtrl);

};

module.exports = errors;
