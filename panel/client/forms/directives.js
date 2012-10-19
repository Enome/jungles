var directives = {
  
  compileHtml: function ($compile) {

    return function (scope, element, attr) {
      scope.$watch(attr.compileHtml, function (value) {
        if (value) {
          element.html($compile(value)(scope));
        } else {
          element.html('');
        }
      });
    };

  }

};

module.exports = directives;
