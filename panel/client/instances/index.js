var controllers = require('./controllers');
var factories = require('./factories');

var instances = function (app) {

  app.factory('instances', factories);
  app.controller('InstanceCtrl', controllers.InstanceCtrl);
  app.controller('InstancesCtrl', controllers.InstancesCtrl);

  app.config(function ($routeProvider, $locationProvider) {
    
    $routeProvider.when('*path', {
      controller: 'InstancesCtrl',
      templateUrl: 'partials/list.html'
    });

  });

};

module.exports = instances;
