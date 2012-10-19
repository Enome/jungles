var controllers = require('./controllers');

var types = function (app) {

  app.controller('RootCtrl', controllers.RootCtrl);
  app.controller('InstancesCtrl', controllers.InstancesCtrl);
  app.controller('InstanceCtrl', controllers.InstanceCtrl);
  app.controller('TypeCtrl', controllers.TypeCtrl);

  app.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider.when('/', {
      controller: 'RootCtrl',
      templateUrl: 'partials/instances.html'
    });

    $routeProvider.when('/instances/:path', {
      controller: 'InstancesCtrl',
      templateUrl: 'partials/instances.html'
    });

  });

};

module.exports = types;
