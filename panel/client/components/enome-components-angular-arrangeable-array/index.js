// Utils

var move = function (array, pos1, pos2) {
  var i, tmp;
  pos1 = parseInt(pos1, 10);
  pos2 = parseInt(pos2, 10);

  if (pos1 !== pos2 && 0 <= pos1 && pos1 <= array.length && 0 <= pos2 && pos2 <= array.length) {
    tmp = array[pos1];
    if (pos1 < pos2) {
      for (i = pos1; i < pos2; i += 1) {
        array[i] = array[i + 1];
      }
    } else {
      for (i = pos1; i > pos2; i -= 1) {
        array[i] = array[i - 1];
      }
    }
    array[pos2] = tmp;
  }
};

// App

require('webfont');

var mod = window.angular.module('arrangeable-array', []);

mod.directive('arrangeableArray', function ($document) {

  return {

    restrict: 'E',
    scope: { array: '=' },
    template: require('./template'),
    replace: true,
    link: function ($scope, root, attrs) {

      var resetExpand = function () {
        var expanded_dropareas = document.querySelector('.expand');

        if (expanded_dropareas) {
          expanded_dropareas.classList.remove('expand');
        }
      };

      // Events
      
      var dragging_row;
      var drop_row;
      
      root.bind('mousedown', function (e) {

        if (e.target.classList.contains('row') && !e.target.classList.contains('last')) {
          dragging_row = e.target;
        }

        if (e.target.parentNode.classList && e.target.parentNode.classList.contains('row')) {
          dragging_row = e.target.parentNode;
        }

        if (dragging_row) {
          dragging_row.style.width = dragging_row.offsetWidth + 'px';
          dragging_row.offsetY = e.pageY - dragging_row.offsetTop; // FF doesn't support offsetY
          dragging_row.parentNode.style.height = dragging_row.parentNode.offsetHeight + 'px';
          
          e.preventDefault();
          return false;
        }

      });

      // On drop

      root.bind('mouseup', function () {
        
        if (dragging_row) {

          if (drop_row) {

            $scope.$apply(function () {

              var pos1 = dragging_row.getAttribute('data-index');
              var pos2 = drop_row.getAttribute('data-index');

              if (pos1 < pos2) {
                pos2 = pos2 - 1;
              }

              move($scope.array, pos1, pos2);

            });

          }

          dragging_row.style.zIndex = 0;
          dragging_row.style.position = 'relative';
          dragging_row.style.top = 'inherit';
          dragging_row.style.width = 'inherit';

          // Reset

          dragging_row.parentNode.parentNode.style.height = 'inherit';

          dragging_row = drop_row = null;
          resetExpand();

        }

      });

      root.bind('mousemove', function (e) {

        if (dragging_row) {
          dragging_row.style.position = 'absolute';
          dragging_row.style.zIndex = 10;
          dragging_row.style.top = (e.pageY - dragging_row.offsetY) + 'px';

          var rows = root[0].querySelectorAll('.row');
          var pageY = e.pageY - ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop);

          [].forEach.call(rows, function (row) {

            var cords = row.getBoundingClientRect();

            if (e.pageX >= cords.left && e.pageX <= cords.right && pageY >= cords.top && pageY <= cords.bottom) {

              if (row !== dragging_row) {
                drop_row = row;
                resetExpand();
                row.classList.add('expand');
              }

            }

          });

        }

      });

    },

    controller: function ($scope) {

      $scope.remove = function (item) {
        $scope.array.splice($scope.array.indexOf(item), 1);
      };

    }

  };

});
