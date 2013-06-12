var controllers = {

  ClipboardCtrl: function ($scope, collections) {
    $scope.clipboard = collections.clipboard;
  },

  ClipboardInstanceCtrl: function ($scope, $window, collections, alerts, instances, clipboard, _) {

    $scope.clear = clipboard.clear;

    $scope.canCopy = function () {
      return _.contains(collections.types, $scope.instance.type);
    };

    $scope.canCopyText = function () {
      if ($scope.canCopy()) {
        return 'Copy here';
      }

      return 'Cannot copy here';
    };

    $scope.copy = function () {

      var copy = JSON.parse(JSON.stringify($scope.instance));
      var is_already_in_instances = _.chain(collections.instances)
        .map(function (instance) { return instance.name.toLowerCase(); })
        .contains(copy.name.toLowerCase())
        .value();
        
      copy.parent = collections.globals.path;
      copy.order = _.max(collections.instances, function (instance) {
        return instance.order;
      }).order + 1 || 1;

      // Name doesn't exist at this level

      if (!is_already_in_instances) {
        $scope.clear();
        return instances.copy.push(copy);
      }

      // Pass it to popup

      return collections.popups.push({ type: 'copy', data: copy });

    };

  },

};

module.exports = controllers;
