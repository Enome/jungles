var kwery = require('kwery');
var marked = require('marked');

module.exports = {
  
  init: function (app) {

    // Get root in tree

    app.locals.getRoot = function (tree, current) {

      var root = current.path.split('/')[1];
      var result = kwery.tree(tree, { path: '/' + root });

      var root;

      result.one(function (response) {
        root = response; // This works cause kwery isn't async.
      });

      return root;

    };

    // Markdown

    app.locals.markdown = function (md) {
      if (md) {
        return marked(md);
      }
      return '';
    };

    // Reverse array and make hard copy

    app.locals.reverse = function (list) {
      return JSON.parse(JSON.stringify(list)).reverse();
    };

    // Make the title pretty

    app.locals.prettyTitle = function (title) {
      return '<span>' + title.split(' ').join('</span><span>') + '</span>';
    };

  }

};
