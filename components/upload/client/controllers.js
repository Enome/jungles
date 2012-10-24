var controllers = {
  
  UploadCtrl: function ($scope) {

    $scope.images = [];
    $scope.files = [];

    $scope.upload = function (element) {
      $scope.$apply(function ($scope) {
        $scope.files = element.files;
      });
    };

    $scope.$watch('files', function () {
      
      for (var i = 0; i < $scope.files.length; i += 1) {

        var current = $scope.files[i];
        var reader = new FileReader();

        reader.onload = (function (file) {
          return function (e) {
            $scope.$apply(function ($scope) {
              $scope.images.push({ name: file.name, src: e.target.result });
            });
          }
        }(current));

        reader.readAsDataURL(current);
      }

    }, true);

  }

};

module.exports = controllers;
