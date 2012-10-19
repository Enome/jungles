var controllers = {

  InstancesActionCtrl: function ($scope, $location, instances, events, general, _) {

    $scope.buttons = [];
    $scope.instances = [];

    events.on('instances: select', function (e, instance) {
      $scope.instances.push(instance);
    });

    events.on('instances: deselect', function (e, instance) {
      $scope.instances = _.reject($scope.instances, function (i) {
        return instance.path === i.path;
      });
    });

    events.on('instances: deselect all', function (e, instance) {
      $scope.instances.length = 0;
    });

    $scope.$watch('instances', function () {

      $scope.buttons.length = 0;

      var editButton = {
        name: 'Edit',
        click: function () {
          var instance = $scope.instances[0];
          $location.path('/instances/edit/' + general.path.encode(instance.path));
          $scope.instances.length = 0;
        }
      };

      var removeButton = {
        name: 'Remove',
        click: function () {

          _.each($scope.instances, function (instance, i) {

            var result = instances.remove(instance);

            result.success(function (data, status) {
              events.emit('instances remove', data.path);
            });

            result.error(function (error) {
              alert('error deleting');
            });

          });

          $scope.instances.length = 0;

        }

      };

      if ($scope.instances.length === 1) {
        $scope.buttons.push(editButton, removeButton);
      }

      if ($scope.instances.length > 1) {
        $scope.buttons.push(removeButton);
      }

    }, true);

  }

};

module.exports = controllers;
