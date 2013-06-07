var async = require('async');
var functions = require('./functions');

var update = function (db, data) {

  var state = {
    db: db,
    data: data,
  };

  return {

    success: function (callback) {

      async.waterfall([

        functions.getInstances.bind(null, state),
        functions.parentData,
        functions.targetData,
        functions.instancesData,
        functions.updateInstances,

      ], function (err, state) {
        callback(state.stored_instances);
      });


    }

  };

};


module.exports = update;
