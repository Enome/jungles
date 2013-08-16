var mod = window.angular.module('extra-events', []);

mod.directive([ 'focus', 'blur', 'keyup', 'keydown', 'keypress' ].reduce(function (container, name) {

  var directiveName = 'ng' + name[0].toUpperCase() + name.substr(1);

  container[directiveName] = ['$parse', 'safeApply', function ($parse, safeApply) {

    return function (scope, element, attr) {

      var fn = $parse(attr[directiveName]);

      element.bind(name, function (event) {

        safeApply(scope, function () {
          fn(scope, { $event : event });
        });

        event.stopPropagation();

      });

    };

  }];

  return container;

}, {}));

module.exports = 'extra-events';
