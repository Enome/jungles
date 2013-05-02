var InstancesCtrl = function ($scope, $routeParams, header, data, collections, _) {

  console.log($routeParams.path);

  $scope.path = $routeParams.path || '/';
  $scope.instances = collections.instances;
  collections.globals.path = $scope.path;

  // Current

  data.instances.get({ path: $scope.path }, function (data) {

    $scope.current = data[0];

    // Types

    collections.types.length = 0;
    collections.types.push.apply(collections.types, data[0].children);

  });
  
  // Instances

  var re = new RegExp('^' + $scope.path + '/[^/]+$');

  if ($scope.path === '/') {
    re = new RegExp('^/[^/]+$');
  }

  data.instances.get({ path: re }, function (data) {
    collections.instances.length = 0;
    collections.instances.push.apply(collections.instances, data);
  });

};

module.exports = InstancesCtrl;
