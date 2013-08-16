var mod = window.angular.module('arrangeable-files', [ require('angular-file-manager'), require('angular-arrangeable-array') ]);

mod.directive('arrangeableFiles', function () {

  return {
    restrict: 'E',
    scope: { selected: '=', fileserver: '=' },
    template: require('./template'),
    link: function (scope) {
      scope.$watch('full_screen', function (v) {
        if (v) {
          window.document.body.style.overflow = 'hidden';
          return;
        }

        window.document.body.style.overflow = 'inherit';
      });
    },
    controller: function ($scope) { $scope.full_screen = false; }
  };

});

module.exports = 'arrangeable-files';
