var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var validation = require('jungles-validation');
var default_schema = require('./schema');

var create = function (settings, datalayer) {

  var oldCreate = datalayer.create;

  return function (data) {

    var ee = new EventEmitter();

    var type = _.find(settings, function (t) {
      return t.name === data.type;
    });

    var rules = _.extend({}, default_schema, type.schema);

    process.nextTick(function () {

      var result = validation(data, rules);

      result.valid(function (sanitized) {
        var create_result = oldCreate(sanitized);
        create_result.success(ee.emit.bind(ee, 'success'));
      });

      result.invalid(ee.emit.bind(ee, 'error'));

    });

    return {
      success: ee.on.bind(ee, 'success'),
      error: ee.on.bind(ee, 'error'),
    };

  };

};

module.exports = create;
