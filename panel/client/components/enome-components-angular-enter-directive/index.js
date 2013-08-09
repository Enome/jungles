var module = window.angular.module('ngEnter', []);

module.directive('ngEnter', function () {

  return function (scope, element, attrs) {

    element.bind('keydown', function (event) {

      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();

      }

    });

  };

});
