var controllers = {

  CreateFormCtrl: function ($scope, $routeParams, $window, data, collections, general, alerts) {

    $scope.data = {
      type: $routeParams.type,
      parent: $routeParams.parent
    };

    $scope.path = $scope.data.parent;
    collections.globals.path = $scope.path;

    // Get Form Url

    $scope.form_url = general.resource_url('/types/' + $scope.data.type + '/form');

    // create

    $scope.submit = function (form_data) {

      data.instances.create(form_data, function (response) {

        if (response.errors) {
          collections.alerts.length = 0;
          collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
          $window.scrollTo(0, 0);
          return;
        }

        collections.alerts.push({
          type: 'success',
          name: 'Created',
          msg: response.path + ' was created',
          keep: true
        });

        $scope.link($scope.data.parent);
        $scope.link($scope.data.parent);

      });

    };

    // Cancel

    $scope.cancel = function () {
      $scope.link($scope.data.parent);
    };

  },

  EditFormCtrl: function ($scope, $routeParams, $window, $location, data, general, collections, alerts, _) {

    $scope.path = $routeParams.path;
    collections.globals.path = general.path.parent($scope.path);
    
    // Get Form Url

    $scope.$watch('data.type', function (type) {
      if (typeof type !== 'undefined') {
        $scope.form_url = general.resource_url('/types/' + type + '/form');
      }
    });

    // Get current instance

    data.instances.get({ path: $scope.path }, function (instances) {

      var current = instances[0];

      // Data

      $scope.data = current;
      
    });

    // create

    $scope.submit = function (form_data) {

      data.instances.update(form_data, function (response) {

        collections.alerts.length = 0;

        if (response.errors) {
          collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
          return;
        }

        collections.alerts.push({
          type: 'success',
          name: 'Saved',
          msg: response.path + ' was saved',
          keep: $scope.path !== response.path
        });

        $location.path('/edit/' + response.path);
        $window.scrollTo(0, 0);

      });

    };

    // Cancel

    $scope.cancel = function () {
      $scope.link(general.path.parent($scope.path));
    };

  }

};

module.exports = controllers;
