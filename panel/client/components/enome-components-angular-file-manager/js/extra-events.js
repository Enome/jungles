var module = window.angular.module('extra-events', []);

module.directive([ 'focus', 'blur', 'keyup', 'keydown', 'keypress' ].reduce(function (container, name) {

  var directiveName = 'ng' + name[0].toUpperCase() + name.substr(1);

  container[directiveName] = ['$parse', function ($parse) {
    return function (scope, element, attr) {
      var fn = $parse(attr[directiveName]);
      element.bind(name, function (event) {

        if (scope.$$phase) {
          return;
        }

        scope.$apply(function () {
          fn(scope, { $event : event });
        });
      });
    };
  } ];

  return container;
}, {}));
