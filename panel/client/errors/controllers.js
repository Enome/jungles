var controllers = {

  ErrorCtrl: function ($scope, events, _) {

    $scope.errors = [];

    events.on('errors', function (e, errors) {
      $scope.errors.length = 0;
      _.each(errors, function (value, key) {
        $scope.errors.push({ name: key, errors: value.join(', ') });
      });
    });

  }

};

module.exports = controllers;
