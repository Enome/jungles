var mod = window.angular.module('breadcrumbs', []);

var pathToNavigation = function (path) {

  var root = { path: '/', name: 'Home' };

  if (path === '/') {
    return [root];
  }

  var navigation = [];

  var i;
  var parts = path.split('/');
  var path_parts = [];

  parts.forEach(function (current) {

    if (current === '') {
      navigation.push(root);
    } else {
      path_parts.push(current);
      navigation.push({ name: current, path: '/' + path_parts.join('/') });
    }

  });

  return navigation;

};

mod.directive('breadCrumbs', function () {
  return {
    restrict: 'E',
    template: '<span ng-repeat="part in path_navigation"> / <button ng-click="navigate(part.path)" title="{{part.name}}">{{ part.name }}</button></span>',
    scope: {
      path: '='
    },
    controller: function ($scope) {
      $scope.$watch('path', function (v) {
        if (v) {
          $scope.path_navigation = pathToNavigation(v);
        }
      });

      $scope.navigate = function (p) {
        $scope.path = p;
      };
    }

  };

});

module.exports = 'breadcrumbs';
