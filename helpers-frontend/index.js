var kwery = require('kwery');
var marked = require('marked');

var helpers = {

  init: function (app) {

    app.locals.getRoot = function (tree, current) {

      var root = current.path.split('/')[1];
      var result = kwery.tree(tree, { path: '/' + root });

      result.one(function (response) {
        root = response; // This works cause kwery isn't async.
      });

      return root;

    };
  
    app.locals.navigation = function (nodes, start, end, current) {

      var traverse = function (ns, lvl) {

        if (!ns) {
          return '';
        }

        lvl += 1;

        var ret = [];

        if (start <= lvl && end >= lvl) {
          ret.push('<ul>');
        }

        ns.forEach(function (node) {

          if (start <= lvl && end >= lvl && !node.navigation_hide) {

            ret.push('<li>');

            ret.push('<a');

            if (new RegExp(node.path + '.*').test(current.path)) {
              ret.push(' class="selected"');
            }

            ret.push(' href="', node.path, '" title="', node.name, '">', node.name, '</a>', traverse(node.children, lvl), '</li>');

          } else {
            ret.push(traverse(node.children, lvl));
          }

        });

        if (start <= lvl && end >= lvl) {
          ret.push('</ul>');
        }

        return ret.join('');

      };

      return traverse(nodes, -1);

    };

    app.locals.markdown = function (md) {

      if (md) {
        return marked(md);
      }

      return '';

    };

    app.locals.findInstancesByType = function (tree, type) {

      var instances;
      var result = kwery.tree(tree, { type: type });

      result.many(function (results) {
        instances = results;
      });

      return instances;

    };

  },

};

module.exports = helpers;
