var module = window.angular.module('files', []);
var Upload = require('upload');

module.controller('FilesCtrl', function ($scope, $http) {

  $scope.uploaded_files = [];
  $scope.files = [];

  $scope.$watch('path', function (v) {

    if (!v) { return; }

    var GET = $http.get($scope.url + '/files/' + $scope.path);

    GET.success(function (data, status, headers, config) {
      $scope.files.length = 0;
      $scope.files.push.apply($scope.files, data);
    });

    GET.error(function (data, status, headers, config) {
      alert('Server Error');
    });

  });

  $scope.$watch('uploaded_files.length', function (v) {

    if (v === 0) { return; }

    $scope.uploaded_files.forEach(function (file) {

      if (file.kind !== 'file') { return; }

      var data = {
        name: file.name,
        path: ($scope.path + '/' + file.name).replace('//', '/'),
        progress: 0,
        uploading: true
      };

      var contains = $scope.files.some(function (file) {
        return file.path === data.path;
      });

      if (contains) {
        alert(data.name + ' already exists');
        return;
      }

      $scope.files.push(data);

      var upload = new Upload(file);

      upload.to($scope.url + '/files/' + $scope.path);

      upload.on('end', function (e) {
        $scope.$apply(function () {
          data.uploading = false;
        });
      });

      upload.on('error', function (e) {
        alert('Server Error');
      });

      upload.on('progress', function (e) {
        $scope.$apply(function () {
          data.progress = parseInt(Math.ceil(e.percent), 10);
        });
      });

    });

    $scope.uploaded_files.length = 0;

  });

});

module.controller('FileCtrl', function ($scope, $http, $timeout) {

  $scope.file.readonly = 'readonly';

  $scope.remove = function (file) {

    var DEL = $http.delete($scope.url + '/files/' + file.path);

    DEL.success(function (data) {
      var i = $scope.files.indexOf(file);
      $scope.files.splice(i, 1);
      $scope.remove_selected(file.path);
    });

  };

  $scope.storeName = function (file) {
    $scope.old_name = file.name;
  };

  $scope.update = function (file) {

    if (file.name === '') {
      file.name = $scope.old_name;
      return;
    }


    if (file.name !== $scope.old_name) {

      var contains = $scope.files.some(function (f) {
        return f.path === ($scope.path + '/' + file.name).replace('//', '/');
      });

      if (contains) {
        alert(file.name + ' already exists');
        file.name = $scope.old_name;
        return;
      }

      var data = {
        path: $scope.path,
        name: file.name.replace(/\//g, ''),
        old_name: $scope.old_name
      };

      var PUT = $http.put($scope.url + '/files/', data);

      PUT.success(function (response) {
        $scope.update_selected(file.path, response.path);
        file.path = response.path;
        file.name = response.name;
      });

      PUT.error(function () {
        file.name = $scope.old_name;
      });

    }

    $scope.enableReadonly($scope.file);

  };

  $scope.$watch('selected.length', function () {
    $scope.s = $scope.selected.some(function (path) {
      return $scope.file.path === path;
    });
  });

  $scope.preview = function (file) {

    if (file.readonly === '') {
      return;
    }

    file.stos.forEach(function (sto) {
      $timeout.cancel(sto);
    });

    file.stos.length = 0;
    window.open($scope.url + '/files/' +  file.path, '_blank');
  };

});
