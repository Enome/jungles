var check = require('validator').check;
var sanitize = require('validator').sanitize;
var utils = require('./utils');

var validators = {

  required: function (msg) {

    return function (data, key, errors, sanitized, callback) {

      try {
        check(data[key], msg).notEmpty();
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  string: function () {
    
    return function (data, key, errors, sanitized, callback) {

      if (typeof data[key] !== 'undefined') {
        sanitized[key] = data[key].toString();
      }
      callback();

    };

  },

  integer: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        check(data[key], msg).isInt();
        sanitized[key] = sanitize(data[key]).toInt();
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  array: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        check(data[key], msg).isArray();
        sanitized[key] = data[key];
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

};

module.exports = validators;
