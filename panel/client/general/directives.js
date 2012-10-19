var directives = {

  documentClick: function ($document, $parse) {

    var linkFunction = function ($scope, $element, $attributes) {

      var scopeExpression = $attributes.documentClick;
      var invoker = $parse(scopeExpression);

      $document.on('click', function (event) {

        $scope.$apply(function () {
          invoker($scope, { $event: event });
        });

      });

    };

    return linkFunction;

  }

};

module.exports = directives;
