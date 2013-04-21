var reject = require('underscore').reject;
var find = require('./find');

module.exports = function (db, query) {

  return {

    success: function (callback) {

      var result = find(db, query);

      result.one(function (node) {
        db.query('DELETE FROM instances WHERE id = $1 or path ~ $2;', [ node.id, '^' + node.path + '.*' ], function (err, result) {
          callback();
        });
      });

    }

  };

};
