var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var validation = require('jungles-validation');
var default_schema = require('./schema');
var async = require('async');

var create = function (settings, datalayer) {

  var oldCreate = datalayer.create;

  return function (data) {

    var ee = new EventEmitter();

    var type = _.find(settings, function (t) {
      return t.name === data.type;
    });

    var rules = _.extend({}, default_schema(datalayer), type.schema);

    var highestOrder = function (callback) {

      if (typeof data.order === 'undefined') {

        var result = datalayer.find({ type: data.type });

        result.many(function (many) {

          var order = 0;

          if (many.length !== 0) {
            var m = _.max(many, function (one) {
              return one.order;
            });

            order = m.order + 1;
          }

          data.order = order;
          callback();

        });

      } else {
        callback();
      }

    };

    var validate = function (callback) {

      process.nextTick(function () {

        var result = validation(data, rules);

        result.valid(function (sanitized) {
          var create_result = oldCreate(sanitized);
          create_result.success(ee.emit.bind(ee, 'success'));
        });

        result.invalid(ee.emit.bind(ee, 'error'));

      });

    };

    async.waterfall([highestOrder, validate]);

    return {
      success: ee.on.bind(ee, 'success'),
      error: ee.on.bind(ee, 'error'),
    };

  };

};

module.exports = create;
