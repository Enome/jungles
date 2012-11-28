var check = require('validator').check;
var sanitize = require('validator').sanitize;
var utils = require('./utils');

var doIfDefined = function (val, func) {
  if (typeof val !== 'undefined' && val !== null) {
    func();
  }
};

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
        doIfDefined(data[key], function () {
          check(data[key], msg).isInt();
          sanitized[key] = sanitize(data[key]).toInt();
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  decimal: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        check(data[key], msg).isDecimal();
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  array: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        if (typeof data[key] !== 'undefined') {
          check(data[key], msg).isArray();
          sanitized[key] = data[key];
        }
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  url: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        doIfDefined(data[key], function () {
          check(data[key], msg).isUrl();
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },


};

module.exports = validators;
