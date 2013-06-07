var reject = require('underscore').reject;
var find = require('./find');
var utils = require('./utils');

module.exports = function (db, query) {

  return {

    success: function (callback) {

      var result = find(db, query);

      result.one(function (instance) {

        db.query('DELETE FROM instances WHERE path ~ $1 RETURNING *;', [ '^' + utils.escapeForRegex(instance.path) + '(/|$)' ], function (err, result) {
          callback(utils.createInstances(result));
        });

      });

    }

  };

};
