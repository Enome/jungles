var icons = function (app) {

  app.controller('IconCtrl', function ($scope, types, _) {

    var base = {
      name: 'icon-file',
      color: 'inherit',
    };

    $scope.getIcon = function (name) {
      var type = _.extend(base, types.get(name).icon);
      return type.name;
    };

    $scope.getStyle = function (name) {
      var type = _.extend(base, types.get(name).icon);
      return { color: type.color };
    };

  });

};

module.exports = icons;
