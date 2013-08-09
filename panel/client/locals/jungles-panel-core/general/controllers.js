var controllers = {

  PageCtrl: function ($scope, $location) {

    $scope.link = function (url) {
      $location.path(url);
    };

  }

};

module.exports = controllers;
