var helpers = {

  init: function (app) {
  
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


          if (start <= lvl && end >= lvl) {

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

  }

};

module.exports = helpers;
