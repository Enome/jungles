var controllers = {

  HeaderCtrl: function ($scope, header, collections, general) {

    $scope.globals = collections.globals;

    $scope.$watch('globals', function () {

      if (collections.globals.path) {
        $scope.path_navigation = header.pathToNavigation(collections.globals.path);
      }

    }, true);

    $scope.back = function () {
      $scope.link(general.path.parent(collections.globals.path));
    };

  }

};

module.exports = controllers;
