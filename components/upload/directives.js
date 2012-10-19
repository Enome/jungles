var template = require('./template');

    var directives = {

      upload: function ($compile) {

        return {
          restrict: 'E',
          link: function (scope, element, attr) {
            scope.url = element.attr('url');
            element.html($compile(template)(scope));
          }
        };

      }

    };

module.exports = directives;
