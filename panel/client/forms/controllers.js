var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, instances, general, _) {

    $scope.data = {
      type: $routeParams.type,
      parent: general.path.decode($routeParams.parent)
    };
    
    // Get Form Url

    $scope.form_url = general.resource_url('/types/' + $scope.data.type + '/form');

    // create

    $scope.submit = instances.create;

    // Cancel

    $scope.cancel = function () {
      $window.history.back();
    };

    // Title

    $scope.title = 'new: ' + $scope.data.type;

  },

  EditFormCtrl: function ($scope, $routeParams, $window, instances, general, _) {

    var path = general.path.decode($routeParams.path);
    
    // Get Form Url

    $scope.$watch('data.type', function (type) {
      if (typeof type !== 'undefined') {
        $scope.form_url = general.resource_url('/types/' + type + '/form');
      }
    });

    // Get current instance

    instances.get({ path: path }, function (instances) {

      var current = instances[0];

      // Data

      $scope.data = current;

      // Title
      
      $scope.title = 'Edit: ' + $scope.data.name;
      
    });

    // create

    $scope.submit = instances.update;

    // Cancel

    $scope.cancel = function () {
      $window.history.back();
    };

  }

};

module.exports = controllers;
