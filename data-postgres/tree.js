var find = require('./find');
var kwery = require('kwery');

module.exports = function (db, query) {

  return {

    success: function (callback) {

      var result = find(db, query);

      result.many(function (response) {

        var tree = [];

        response.forEach(function (node) {

          var parent_path = node.path.replace(/\/[^\/]+$/, '');

          var result = kwery.tree(tree, { path: parent_path });

          result.one(function (parent) {

            if (typeof parent.children === 'undefined') {
              parent.children = [];
            }

            parent.children.push(node);

          });

          result.empty(function () {
            tree.push(node);
          });

        });

        callback(tree);


      });

    }

  };

};
