var controllers = {

  AlertsCtrl: function ($scope, collections) {

    /* Format
    * var errors = [
    * { type: 'success/error', name: 'Bold text', msg: 'None bold text', keep: 'boolean' },
    * ];
    */

    $scope.alerts = collections.alerts;

    $scope.$on('$locationChangeSuccess', function () {

      var i;

      for (i = $scope.alerts.length - 1; i >= 0; i -= 1) {
        
        var current = $scope.alerts[i];

        if (!current.keep) {
          $scope.alerts.splice(i, 1);
        } else {
          current.keep = false;
        }

      }

    });

    $scope.close = function (alert) {
      collections.alerts.forEach(function (a, i) {
        if (a === alert) {
          collections.alerts.splice(i, 1);
        }
      });
    };

    // Icon

    $scope.getIcon = function (alert) {
      if (alert.type === 'success') {
        return 'icon-ok';
      }

      if (alert.type === 'error') {
        return 'icon-remove';
      }
    };

    $scope.getStyle = function (alert) {
      if (alert.type === 'success') {
        return { color: '#00B200' };
      }

      if (alert.type === 'error') {
        return { color: '#E74C3C' };
      }
    };

  }

};

module.exports = controllers;
