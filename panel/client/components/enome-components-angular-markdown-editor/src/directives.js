var directives = {

  markdownEditor: function (selection) {

    return {
      restrict: 'E',
      controller: 'MarkdownEditorCtrl',
      template: require('../template'),
      replace: true,
      scope: { data: '=', fileserver: '=' },
      link: function (scope, element, attr) {

        var textarea = element.find('textarea');

        textarea.bind('blur', function (e) {
          var self = this;
          scope.$apply(function () {
            scope.selection = { start: self.selectionStart, end: self.selectionEnd };
          });
        });

        scope.focusTextarea = function () {
          selection.setRange(textarea[0], scope.selection.start, scope.selection.end);
        };

        // Open links in target='_blank'
        
        element.bind('click', function (e) {

          if (e.target.tagName === 'A') {
            window.angular.element(e.target).attr('target', '_blank');
          }

        });

      }
    };

  },

};

module.exports = directives;
