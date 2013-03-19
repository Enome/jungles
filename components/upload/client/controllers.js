var controllers = {
  
  UploadCtrl: function ($scope, $http, _) {

    $scope.upload = function (element) {
      $scope.$apply(function ($scope) {
        $scope.files = element.files;
      });
    };

    $scope.isImage = function (path) {
      return false;
    };

    $scope.remove = function (file) {
      $scope.current = _.reject($scope.current, function (f) {
        return file === f;
      });
    };

    $scope.$watch('files', function (value, v) {
      
      if (typeof value === 'undefined') {
        return;
      }

      var i;

      for (i = 0; i < value.length; i += 1) {

        var current = value[i];
        var reader = new window.FileReader();

        reader.readAsDataURL(current);

        (function () {

          var name = current.name;

          reader.onload = function (e) {
            var result = $http.post($scope.url + '/' + name, { file : e.target.result });

            result.success(function (data, status, headers, config) {
              if (typeof $scope.current === 'undefined') {
                $scope.current = [];
              }
              $scope.current.push(data.file);
            });
          };

        }());

      }

    }, true);

  }

};

module.exports = controllers;
