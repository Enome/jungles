var controllers = {

  AlertsCtrl: function ($scope, events, _) {

    var setEvents = function (event) {

      $scope[event] = [];

      events.on(event, function (e, items) {

        $scope[event].length = 0;

        setTimeout(function () {
          _.each(items, function (value, key) {
            $scope.$apply(function () {
              $scope[event].push({ name: key, message: value.join(', ') });
            });
          });
        }, 50);

      });

    };

    setEvents('errors');
    setEvents('warnings');

  }

};

module.exports = controllers;
