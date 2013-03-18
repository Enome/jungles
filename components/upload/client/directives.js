var directives = {

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
