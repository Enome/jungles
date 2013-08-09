var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, instances, collections, general, alerts, _) {

    var max_order = _.max(collections.instances, function (instance) {
      return instance.order;
    });

    $scope.data = {
      type: $routeParams.type,
      parent: $routeParams.parent,
      order: max_order ? max_order.order + 1 : 1
    };

    $scope.path = $scope.data.parent;

    collections.globals.path = $scope.path;

    // Get Form Url

    $scope.form_url = general.resource_url('/types/' + $scope.data.type + '/form');

    // create

    $scope.submit = instances.create.push;

    // Cancel

    $scope.cancel = function () {
      $scope.link($scope.data.parent);
    };

  },

  EditFormCtrl: function ($scope, $routeParams, $window, $location, instances, general, collections, alerts, _) {

    $scope.path = $routeParams.path;
    collections.globals.path = general.path.parent($scope.path);
    
    // Get Form Url

    $scope.$watch('data.type', function (type) {
      if (typeof type !== 'undefined') {
        $scope.form_url = general.resource_url('/types/' + type + '/form');
      }
    });

    // Get current instance

    instances.get({ path: $scope.path }, function (instances) {

      var current = instances[0];

      // Data

      $scope.data = current;
      
    });

    // create

    $scope.submit = instances.update.push;

    // Cancel

    $scope.cancel = function () {
      $scope.link(general.path.parent($scope.path));
    };

  }

};

module.exports = controllers;
