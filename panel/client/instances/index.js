var controllers = require('./controllers');
var factories = require('./factories');

var services = function (app) {

  app.controller('InstanceCtrl', controllers.InstanceCtrl);
  app.controller('InstancesCtrl', controllers.InstancesCtrl);

  app.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider.when('*path', {
      controller: 'InstancesCtrl',
      templateUrl: 'partials/instances.html'
    });

  });

};

module.exports = services;
