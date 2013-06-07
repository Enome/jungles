var async = require('async');
var functions = require('./functions');

var create = function (db, data) {

  var state = {
    db: db,
    data: data
  };

  return {

    success: function (callback) {

      async.waterfall([

        functions.getParent.bind(null, state),
        functions.targetData,
        functions.createInstances,

      ], function (err, state) {
        callback(state.stored_instances);
      });

    }

  };

};

module.exports = create;
