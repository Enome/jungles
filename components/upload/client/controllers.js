var controllers = {
  
  UploadCtrl: function ($scope, $http, _) {

    $scope.files = [];

    $scope.upload = function (element) {
      $scope.$apply(function ($scope) {
        $scope.files = element.files;
      });
    };

    $scope.remove = function (file) {
      $scope.current = _.reject($scope.current, function (f) {
        return file === f;
      });
    };

    $scope.$watch('files', function () {
      
      for (var i = 0; i < $scope.files.length; i += 1) {

        var current = $scope.files[i];
        var reader = new FileReader();
        reader.readAsDataURL(current);

        reader.onload = function (e) {
          var result = $http.post($scope.url + '/' + current.name, { file : e.target.result });

          result.success(function (data, status, headers, config) { 
            if (typeof $scope.current === 'undefined') {
              $scope.current = [];
            }
            $scope.current.push(data.file);
          });
        }

      }

    }, true);

  }

};

module.exports = controllers;
