var controllers = {

  TypesCtrl: function ($scope, collections) {
    $scope.types = collections.types;
  }

};

var types = function (app) {
  app.controller('TypesCtrl', controllers.TypesCtrl);
};

module.exports = types;
