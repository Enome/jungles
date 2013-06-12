var controllers = {

  TypesCtrl: function ($scope, collections, types) {

    $scope.globals = collections.globals;
    $scope.types = collections.types;

    $scope.$watch('globals', function () {

      if ($scope.globals.type) {
        collections.types.length = 0;
        collections.types.push.apply(collections.types, types.get($scope.globals.type).children);
      }

    }, true);

  }

};

module.exports = controllers;
