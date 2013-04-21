var utils = require('jungles-validators')._utils;

var validators = {

  uniqueName: function (data_layer, msg) {

    return function (data, key, errors, sanitized, callback) {

      var parent = data.parent || data.path.replace('/' + data.path.split('/').pop(), '');
      var regex = new RegExp('^' + parent + '[^/]+$');
      var result = data_layer.find({ path: regex });
      var found = false;

      result.many(function (many) {

        if (many.length === 0) {
          return callback();
        }

        many.forEach(function (one) {

          if (one.name.toLowerCase() === data.name.toLowerCase() && data.path !== one.path) {
            found = true;
          }

        });

        if (found) {
          utils.pushValue(errors, key, msg || 'Should be unique');
        }

        callback();

      });

    };

  },


};

module.exports = validators;
