var _ = require('underscore');
var qs = require('querystring');
var EventEmitter = require('events').EventEmitter;

var instances = function ($http, $window, general, events, _) {

  var save = function (type, data) {

    var result = $http[type](general.resource_url('/instances'), data);

    result.success(function (data, status, headers, config) {
      if (data.errors) {
        return events.emit('errors', data.errors);
      }

      if (type === 'post') {
        return $window.history.back();
      }

      var alert = {};
      alert[data.name] = [ 'was saved' ];
      events.emit('warnings', alert);

    });

  };

  return {

    get: function (query, callback) {
      _.each(query, function (value, key) {
        if (value instanceof RegExp) {
          query[key] = 'regex-' + value.toString();
        }
      });

      var url = general.resource_url('/instances?' + qs.stringify(query));
      var result = $http.get(url);
      result.success(callback);
    },

    create: save.bind(null, 'post'),
    update: save.bind(null, 'put'),

    remove: function (instance) {

      var result = $http.delete(general.resource_url('/instances/' + instance.path));
      var ee = new EventEmitter();

      result.success(function (data, status, headers, config) {
        ee.emit('success', data);
      });

      result.error(function (data, status, headers, config) {
        ee.emit('error', data);
      });

      return {
        success: function (callback) {
          ee.on('success', callback);
        },

        error: function (callback) {
          ee.on('error', callback);
        }
      };


    }
    
  };

};

var types = function ($http, general) {

  return {

    get: function (query, callback) {
      var url = general.resource_url('/types?' + qs.stringify(query));
      var result = $http.get(url);
      result.success(callback);
    }
    
  };

};

module.exports = {
  instances: instances,
  types: types
};
