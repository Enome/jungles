var controllers = {

  MarkdownEditorCtrl: function ($scope, $timeout, stringBuilder) {

    $scope.selected_files = [];
    $scope.show_file_manager = false;

    $scope.toggle = function () {
      $scope.fullscreen = !$scope.fullscreen;
    };

    $scope.selection = { start: 0, end: 0 };

    $scope.toggleFileManager = function () {
      $scope.show_file_manager = !$scope.show_file_manager;
    };

    var reset = function () {
      $scope.selected_files.length = 0;
      $scope.toggleFileManager();
      $timeout(function () { $scope.focusTextarea(); }, 0);
    };

    $scope.insertImage = function () {

      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);

      $scope.selected_files.forEach(function (file) {
        data.add('![' + window.escape(file.split('/').pop()) + '](' + $scope.fileserver + window.escape(file) + ')');
      });

      $scope.data = data.build();
      $scope.selection.end = $scope.selection.start + data.length;
      reset();

    };

    $scope.insertLink = function () {

      var data = stringBuilder($scope.data, $scope.selection.start, $scope.selection.end);

      $scope.selected_files.forEach(function (file) {
        data.add('[' + window.escape(file.split('/').pop()) + '](' + $scope.fileserver + window.escape(file) + ')');
      });

      $scope.data = data.build();
      $scope.selection.end = $scope.selection.start + data.length;
      reset();

    };

  }

};

module.exports = controllers;
