var async = require('async');

var update_funcs = require('./update/functions');
var create_funcs = require('./create/functions');

var copy = function (db, data) {

  var state = {
    db: db,
    data: data,
  };

  return {

    success: function (callback) {

      async.waterfall([

        update_funcs.getInstances.bind(null, state),
        update_funcs.parentData,
        update_funcs.targetData,
        update_funcs.instancesData,
        create_funcs.createInstances,

      ], function (err, state) {
        callback(state.stored_instances);
      });

    }

  };

};

module.exports = copy;
