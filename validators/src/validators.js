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
        utils.doWhenNotEmpty(data[key], function () {
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
        utils.doWhenNotEmpty(data[key], function () {
          check(data[key], msg).isDecimal();
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  email: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        utils.doWhenNotEmpty(data[key], function () {
          check(data[key], msg).isEmail();
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  array: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        utils.doWhenNotEmpty(data[key], function () {
          check(data[key], msg).isArray();
          sanitized[key] = data[key];
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  url: function (msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        utils.doWhenNotEmpty(data[key], function () {
          check(data[key], msg).isUrl();
        });
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  compare: function (other_value, msg) {

    return function (data, key, errors, sanitized, callback) {
      try {
        if (data[key] !== data[other_value]) {
          throw new Error('Didn\'t equal ' + other_value);
        }
      } catch (e) {
        utils.pushValue(errors, key, e.message);
      }
      callback();
    };

  },

  generic: function (func) {

    return function (data, key, errors, sanitized, callback) {

      func(data, key, function (err, dat) {

        if (err) {
          utils.pushValue(errors, key, err);
          return callback();
        }

        sanitized[key] = dat;
        callback();

      });

    };

  },

};

module.exports = validators;
