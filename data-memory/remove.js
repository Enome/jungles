var reject = require('underscore').reject;
var find = require('./find');

module.exports = function (db, query) {

  return {

    success: function (callback) {

      var result = find(db, query);

      result.one(function (node) {

        var retur = [];
        var _db = db.slice(0);
        db.length = 0;

        var re = new RegExp(node.path + '\\w*');

        _db.forEach(function (el, i) {
          if (!re.test(el.path)) {
            db.push(el);
          } else {
            retur.push(el);
          }
        });

        callback(retur);

      });

    }

  };

};
