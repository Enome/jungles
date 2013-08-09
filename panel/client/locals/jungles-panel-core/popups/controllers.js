var controllers = {

  CopyPopupCtrl: function ($scope, collections, instances, clipboard, _) {

    $scope.popups = collections.popups;
    $scope.show = false;
    $scope.data = { name: '' };

    $scope.$watch('popups', function () {
      $scope.popups.forEach(function (popup) {
        if (popup.type === 'copy') {
          $scope.show = true;
          $scope.data = popup.data;
        }
      });
    }, true);

    $scope.validate = function (form_invalid, new_name) {
      var name_already_exists = _.chain(collections.instances)
        .map(function (instance) { return instance.name.toLowerCase(); })
        .contains((new_name || '').toLowerCase())
        .value();

      return form_invalid || name_already_exists;
    };

    $scope.rename = function () {
      $scope.data.name = $scope.new_name;
      $scope.new_name = '';
      clipboard.clear($scope.data);
      instances.copy.push($scope.data);
      $scope.close();
    };

    $scope.close = function () {
      collections.popups.length = 0;
      $scope.show = false;
    };

  }

};

module.exports = controllers;
