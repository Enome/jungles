var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var validation = require('jungles-validation');
var default_schema = require('./schema');

var update = function (settings, datalayer) {

  var oldCreate = datalayer.update;

  return function (data) {

    var ee = new EventEmitter();

    var find = datalayer.find({ path: data.path });

    find.one(function (resp) {

      var type = _.find(settings, function (t) {
        return t.name === resp.type;
      });

      var rules = _.extend({}, default_schema(datalayer), type.schema);

      process.nextTick(function () {

        var result = validation(_.extend(resp, data), rules);

        result.valid(function (sanitized) {
          var update = oldCreate(sanitized);
          update.success(ee.emit.bind(ee, 'success'));
        });

        result.invalid(ee.emit.bind(ee, 'error'));

      });
    });


    return {
      success: ee.on.bind(ee, 'success'),
      error: ee.on.bind(ee, 'error'),
    };

  };

};

module.exports = update;
