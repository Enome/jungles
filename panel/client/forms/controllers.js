var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, forms, instances, general, _) {

    $scope.data = {
      type: $routeParams.type,
      parent: general.path.decode($routeParams.parent)
    };
    
    // Get Form

    forms.get($routeParams.type, function (form) {
      $scope.extra = form;
    });

    // create

    $scope.submit = instances.create;

    // Cancel

    $scope.cancel = function () {
      $window.history.back();
    };

    // Title

    $scope.title = 'new: ' + $scope.data.type;

  },

  EditFormCtrl: function ($scope, $routeParams, $window, instances, forms, general, _) {

    var path = general.path.decode($routeParams.path);
    
    // Get Form

    $scope.$watch('data.type', function (type) {
      if (type) {
        forms.get(type, function (form) {
          $scope.extra = form;
        });
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
