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

  }

};

module.exports = controllers;
