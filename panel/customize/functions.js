var _ = require('underscore');
var async = require('async');
var fs = require('fs');

var functions = {

  merge: function (components, type, callback) {

    var files = _.map(components, function (component) {
      return component[type];
    });

    files = _.compact(files);

    async.map(files, fs.readFile, function (err, result) {
      callback(result.join(''));
    });

  },

  javascript: function (components, callback) {
    functions.merge(components, 'js', callback);
  },

  css: function (components, callback) {
    functions.merge(components, 'css', callback);
  },

  assets: function (components, name, file) {

    var component = _.find(components, function (component) {
      return component.name === name;
    });

    return component.assets + '/' + file;

  },


};

module.exports = functions;
