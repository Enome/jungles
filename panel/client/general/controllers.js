var controllers = {

  PageCtrl: function ($scope, $window, events) {

    $scope.deselect = function (e) {
      if (!$window.$(e.target).is('.instance')) {
        events.emit('instances: deselect all');
      }
    };

  }

};

module.exports = controllers;
