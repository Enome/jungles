var InstancesCtrl = function ($scope, $routeParams, header, instances, collections, general, _) {

  $scope.path = $routeParams.path || '/';
  $scope.instances = collections.instances;
  collections.globals.path = $scope.path;

  // Current & Instances

  var re = new RegExp('^' + instances.escapeForRegex($scope.path) + '(/[^/]+$|$)');

  if ($scope.path === '/') {
    re = new RegExp('^/[^/]+$');
  }

  instances.get({ path: re }, function (response) {

    if ($scope.path === '/') {
      response.splice(0, 0, {
        name: 'root',
        type: 'root',
        path: '/',
      });
    }

    // 404

    if (response.length === 0) {
      return;
    }

    collections.globals.type = response.shift().type;
    collections.instances.length = 0;
    collections.instances.push.apply(collections.instances, response);

  });

};

var InstanceCtrl = function ($scope, instances, collections, _) {

  $scope.remove = function () {

    // UI Remove

    collections.instances.forEach(function (instance, i) {
      if (instance.path === $scope.instance.path) {
        collections.instances.splice(i, 1);
      }
    });

    // Clipboard Remove

    collections.clipboard.forEach(function (instance, i) {
      if (instance.path === $scope.instance.path) {
        collections.clipboard.splice(i, 1);
      }
    });

    // Database Remove

    instances.remove.push($scope.instance);

  };

  // Move

  $scope.clipboard = function () {

    var isAlreadyInClipboard = _.chain(collections.clipboard)
      .map(function (instance) { return instance.path; })
      .contains($scope.instance.path)
      .value();

    if (!isAlreadyInClipboard) {
      collections.clipboard.push(JSON.parse(JSON.stringify($scope.instance)));
    }
  };

};

module.exports = { InstanceCtrl: InstanceCtrl, InstancesCtrl: InstancesCtrl };
