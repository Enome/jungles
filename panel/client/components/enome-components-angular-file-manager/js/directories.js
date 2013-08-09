var module = window.angular.module('directories', []);

module.controller('DirectoriesCtrl', function ($scope, $http) {

  $scope.directories = [];

  $scope.$watch('path', function (v) {

    if (!v) { return; }

    var GET = $http.get($scope.url + '/directories/' + $scope.path);

    GET.success(function (data, status, headers, config) {
      $scope.directories.length = 0;
      $scope.directories.push.apply($scope.directories, data);
    });

    GET.error(function (data, status, headers, config) {
      console.log('error');
    });

  });

  $scope.create = function () {

    if (!$scope.directory_name) {
      return;
    }

    var data = {
      path: $scope.path,
      name: $scope.directory_name.replace(/\//g, '')
    };

    var contains = $scope.directories.some(function (directory) {
      return directory.path === ($scope.path + '/' + $scope.directory_name).replace('//', '/');
    });

    if (contains) {
      alert(data.name + ' already exists');
      return;
    }
    
    var POST = $http.post($scope.url + '/directories/', data);

    POST.success(function (data) {
      $scope.directory_name = '';
      $scope.directories.push(data);
    });

    POST.error(function () {
      alert('Server error');
    });


  };

});

module.controller('DirectoryCtrl', function ($scope, $http, $timeout) {

  $scope.directory.readonly = 'readonly';

  $scope.remove = function (directory) {
    var DEL = $http.delete($scope.url + '/directories/' + directory.path);

    DEL.success(function (data) {
      var i = $scope.directories.indexOf(directory);
      $scope.directories.splice(i, 1);
      $scope.remove_selected(directory.path);
    });

    DEL.error(function (data) {
      alert('Server error');
    });
  };

  $scope.storeName = function (directory) {
    $scope.old_name = directory.name;
  };

  $scope.update = function (directory) {

    if (directory.name === '') {
      directory.name = $scope.old_name;
      return;
    }

    if (directory.name !== $scope.old_name) {

      var contains = $scope.directories.some(function (f) {
        return f.path === ($scope.path + '/' + directory.name).replace('//', '/');
      });

      if (contains) {
        alert(directory.name + ' already exists');
        directory.name = $scope.old_name;
        return;
      }

      var data = {
        path: $scope.path,
        name: directory.name.replace(/\//g, ''),
        old_name: $scope.old_name
      };

      var PUT = $http.put($scope.url + '/directories/', data);

      PUT.success(function (response) {
        $scope.update_selected(directory.path, response.path);
        directory.path = response.path;
        directory.name = response.name;
      });

      PUT.error(function () {
        directory.name = $scope.old_name;
      });
    }

    $scope.enableReadonly(directory);

  };

  $scope.s = $scope.selected.some(function (path) {
    return $scope.directory.path === path;
  });

  $scope.visit = function (directory) {

    if (directory.readonly === '') {
      return;
    }

    directory.stos.forEach(function (sto) {
      $timeout.cancel(sto);
    });

    directory.stos.length = 0;

    $scope.link(directory.path);

  };

});
