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

module.exports = InstanceCtrl;
