var controllers = require('./controllers');

var forms = function (app) {
  app.controller('CreateFormCtrl', controllers.CreateFormCtrl);
  app.controller('EditFormCtrl', controllers.EditFormCtrl);

  app.config(function ($routeProvider) {

    $routeProvider.when('/new/:type/*parent', {
      controller: 'CreateFormCtrl',
      templateUrl: 'partials/form.html'
    });

    $routeProvider.when('/edit/*path', {
      controller: 'EditFormCtrl',
      templateUrl: 'partials/form.html'
    });

  });
};

module.exports = forms;
