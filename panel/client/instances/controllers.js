var InstancesCtrl = function ($scope, $routeParams, header, data, collections, general, _) {

  $scope.path = $routeParams.path || '/';
  $scope.instances = collections.instances;
  collections.globals.path = $scope.path;

  // Current

  data.instances.get({ path: $scope.path }, function (data) {

    if (data.length === 0) {

      collections.alerts.push({
        type: 'error',
        name: 'Not found',
        msg: 'No content was found at ' + $scope.path
      });

      return;

    }

    $scope.current = data[0];

    // Types

    collections.types.length = 0;
    collections.types.push.apply(collections.types, data[0].children);

  });
  
  // Instances

  var re = new RegExp('^' + $scope.path + '/[^/]+$');

  if ($scope.path === '/') {
    re = new RegExp('^/[^/]+$');
  }

  data.instances.get({ path: re }, function (data) {
    collections.instances.length = 0;
    collections.instances.push.apply(collections.instances, data);
  });


};

var InstanceCtrl = function ($scope, data, collections) {

  $scope.instance.remove = function () {

    // UI Remove

    var i;
    for (i = 0; i < collections.instances.length; i += 1) {
      if (collections.instances[i].path === $scope.instance.path) {
        collections.instances.splice(i, 1);
        break;
      }
    }

    // Database Remove

    var result = data.instances.remove($scope.instance);

    result.success(function (data, status) {

      collections.alerts.length = 0;

      collections.alerts.push({
        type: 'success',
        name: 'Removed',
        msg: $scope.instance.path
      });

    });

    result.error(function (error) {

      collections.alerts.length = 0;

      collections.alerts.push({
        type: 'error',
        name: 'Removed',
        msg: $scope.instance.path + ' failed.'
      });

    });

  };

};

module.exports = { InstanceCtrl: InstanceCtrl, InstancesCtrl: InstancesCtrl };
