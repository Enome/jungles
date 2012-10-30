var _ = require('underscore');
var async = require('async');

var functions = {

  javascript: function (callbacks, callback) {

    if (typeof callbacks === 'undefined') {
      return callback('');
    }

    if (typeof functions._js === 'undefined') {

      functions._js = '';

      async.series(callbacks, function (err, result) {

        functions._js = _.reduce(result, function (memo, component) {

          if (typeof component.javascript !== 'undefined') {
            return memo + component.javascript + '\n';
          }

          return memo;

        }, '');

        callback(functions._js);

      });

    } else {
      callback(functions._js);
    }

  },

  css: function (callbacks, callback) {

    if (typeof callbacks === 'undefined') {
      return callback('');
    }

    if (typeof functions._css === 'undefined') {

      functions._css = '';

      async.series(callbacks, function (err, result) {

        functions._css = _.reduce(result, function (memo, component) {

          if (typeof component.css !== 'undefined') {
            return memo + component.css + '\n';
          }

          return memo;

        }, '');

        callback(functions._css);

      });

    } else {
      callback(functions._css);
    }

  },


  html: function (callbacks, callback) {

    if (typeof callbacks === 'undefined') {
      return callback({});
    }

    if (typeof functions._html === 'undefined') {

      functions._html = {};

      async.series(callbacks, function (err, result) {

        _.extend(functions._html, _.reduce(result, function (memo, component) {
          if (typeof component.html !== 'undefined') {
            _.each(component.html, function (page) {
              memo[page.name] = page.html;
            });
          }

          return memo;
        }, {}));

        callback(functions._html);

      });

    } else {
      callback(functions._html);
    }

  }

};

module.exports = functions;
