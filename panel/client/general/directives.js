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

            confirmed = e.target === el[0];

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

        $(el).keydown(function (e) {

          console.log(e.which);

          if (e.which === 27) {
            $scope.$apply(function (event) {
              $parse(attr.esckeypress)($scope, { $event: event });
            });
          }

        });


      }

    };

  }

};

module.exports = directives;
