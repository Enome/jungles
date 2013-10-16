var mod = window.angular.module('ngEnter', [ require('angular-safe-apply') ]);

mod.directive('ngEnter', function ($parse, safeApply) {

  return function (scope, element, attrs) {

    element.bind('keydown', function (event) {

      var fn = $parse(attrs['ngEnter']);

      if (event.which === 13) {

        safeApply(scope, function () {
          fn(scope, { $event : event });
        });

      }

    });

  };

});

module.exports = 'ngEnter';
