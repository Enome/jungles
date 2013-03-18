;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){var controllers = require('./controllers');
var directives = require('./directives');
var filters = require('./filters');

var app = window.jungles;

app.filter('fileType', filters.fileType);
app.filter('fileName', filters.fileName);
app.controller('UploadCtrl', controllers.UploadCtrl);
app.directive('upload', directives.upload);

},{"./controllers":2,"./directives":3,"./filters":4}],2:[function(require,module,exports){var controllers = {
  
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

    $scope.$watch('files', function (value) {
      
      if (typeof value === 'undefined') {
        return;
      }

      var i;
      for (i = 0; i < value.length; i += 1) {

        var current = $scope.files[i];
        var reader = new window.FileReader();
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

},{}],3:[function(require,module,exports){var directives = {

  upload: function ($compile) {

    return {
      restrict: 'E',
      controller: 'UploadCtrl',
      templateUrl: 'custom/assets/upload/template.html',
      scope: {
        current: '=ngModel',
      },
      link: function (scope, element, attr) {
        scope.url = attr.url;
      }
    };

  }

};

module.exports = directives;

},{}],4:[function(require,module,exports){var files_functions = require('../../../files/functions');

var filters = {

  fileType: function () {

    return function (path) {

      var ex = path.substring(path.lastIndexOf('.')).toLowerCase();

      if (ex === '.png' || ex === '.jpg' || ex === '.jpeg' || ex === '.gif') {
        return path;
      }

      return 'custom/assets/upload/file.png';

    };

  },

  fileName: function () {
    
    return function (path) {
      return files_functions.getFilename(path);
    };

  },

};

module.exports = filters;

},{"../../../files/functions":5}],5:[function(require,module,exports){var functions = {

  getFilename: function (name) {
    var extension = name.lastIndexOf('.') === -1 ? '' : '.' + name.split('.').pop();
    var uuid = name.substring(0, 36);
    var filename = name.replace(uuid, '');

    if (filename.length === extension.length) {
      return uuid + extension;
    }

    return filename;
  }

};

module.exports = functions;

},{}]},{},[1]);