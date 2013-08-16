require('webfont');

var mod = window.angular.module('file-manager', [
  require('angular-safe-apply'),
  require('angular-enter-directive'),
  require('angular-droparea'),
  require('./js/breadcrumbs'),
  require('./js/extra-events'),
  require('./js/directories'),
  require('./js/files')
]);

mod.run(function ($templateCache) {
  window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });
});

mod.directive('fileManager', function () {
  return {
    restrict: 'E',
    template: require('./template'),
    replace: true,
    scope: { url: '=', selected: '=selected' },
    controller: function ($scope, $timeout) {

      if (typeof $scope.selected === 'undefined') {
        $scope.selected = [];
      }

      $scope.path = '/';

      $scope.link = function (path) {
        $scope.path = path;
      };

      $scope.select = function (item, checked) {

        if (checked) {
          return $scope.selected.push(item.path);
        }

        $scope.selected.splice($scope.selected.indexOf(item.path), 1);

      };

      $scope.update_selected = function (old_path, new_path) {

        if ($scope.selected.some(function (path) { return path === old_path; })) {
          $scope.selected.splice($scope.selected.indexOf(old_path), 1, new_path);
        }

      };

      $scope.remove_selected = function (path) {

        var i;
        var re = new RegExp('^' + path.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + '($|/)');

        for (i = $scope.selected.length - 1; i >= 0; i -= 1) {
          if (re.test($scope.selected[i])) {
            $scope.selected.splice(i, 1);
          }
        }

      };

      $scope.enableRead = function (i) {

        if (i.readonly === '') {
          return;
        }

        if (typeof i.stos === 'undefined') {
          i.stos = [];
        }

        i.stos.push($timeout(function () {
          i.readonly = '';
        }, 250, true));

      };

      $scope.enableReadonly = function (i) {
        i.readonly = 'readonly';
      };

      $scope.unfocus = function (e) {
        e.target.blur();
      };

    }

  };

});

module.exports = 'file-manager';
