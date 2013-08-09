var marked = require('marked');

var filters = {

  markdown: function () {

    return function (input) {
      if (input) {
        return marked(input);
      }
      return '';
    };

  }

};

module.exports = filters;
