var async = require('async');
var EventEmitter = require('events').EventEmitter;

var flattenSchema = function (data, schema, errors, sanitize) {

  var validators = [];
  var key;

  for (key in schema) {

    if (schema.hasOwnProperty(key)) {

      schema[key].forEach(function (validator) {
        validators.push(validator.bind(null, data, key, errors, sanitize));
      });

    }

  }

  return validators;

};


var validate = function (data, schema) {

  var errors = {};
  var sanitize =  {};

  var validators = flattenSchema(data, schema, errors, sanitize);

  var eventEmitter = new EventEmitter();

  process.nextTick(function () {
    async.parallel(validators, function (err, result) {

      if (Object.keys(errors).length === 0) {
        eventEmitter.emit('valid', sanitize);
      } else {
        eventEmitter.emit('invalid', errors);
      }

    });
  });

  return {
    
    valid: function (callback) {
      eventEmitter.on('valid', callback);
    },

    invalid: function (callback) {
      eventEmitter.on('invalid', callback);
    }

  };

};


module.exports = validate;
