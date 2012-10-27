var template = require('./template');

var directives = {

  upload: function ($compile) {

    return {
      restrict: 'E',
      controller: 'UploadCtrl',
      template: template,
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
