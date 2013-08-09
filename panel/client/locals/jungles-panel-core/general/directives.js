var directives = {

  confirmClick: function ($document, $parse) {

    return {
      restrict: 'A',
      link: function ($scope, el, attr) {

        var fn = $parse(attr.confirmClick);

        var confirmed = false;

        el.bind('click', function () {

          if (confirmed) {
            $scope.$apply(function (event) {
              fn($scope, { $event: event });
            });
          }

        });

        $document.on('click', function (e) {

          $scope.$apply(function () {

            confirmed = e.target === el[0] || e.target.parentNode === el[0];
            if (!confirmed) {
              return $(el).removeClass('confirm');
            }

            $(el).addClass('confirm');

          });

        });

      }

    };

  },

  esckeypress: function ($document, $parse) {

    return {
      restrict: 'A',
      link: function ($scope, el, attr) {

        var handler = function (e) {
          if (e.which === 27) {
            $scope.$apply(function (event) {
              $parse(attr.esckeypress)($scope, { $event: event });
            });
          }
        };

        $($document).keydown(handler);

        $scope.$on('$destroy', function () {
          $($document).unbind('keydown', handler);
        });

      }

    };

  }

};

module.exports = directives;
