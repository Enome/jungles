var oar = require('oar');
var qs = require('querystring');

var factories = function ($http, $rootScope, $window, $location, general, collections, alerts, _) {

  var multipleResultMsg = function (results) {

    var paths = _.map(results, function (instance) { return instance.path; });

    paths.sort(function (a, b) {
      return a.length - b.length;
    });

    if (paths.length > 3) {
      return paths.slice(0, 3).join(', ') + ', ...';
    }

    return paths.join(', ');

  };

  var t = {

    escapeForRegex: function (s) {
      return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },

    get: function (query, callback) {
      var key;
      for (key in query) {
        if (query.hasOwnProperty(key)) {
          if (query[key] instanceof RegExp) {
            query[key] = 'regex-' + query[key].toString();
          }
        }
      }

      var result = $http.get(general.resource_url('/instances?' + qs.stringify(query)));
      result.success(function (response) {
        callback(response);
      });
    },

    remove: oar(),
    create: oar(),
    update: oar(),
    copy: oar(),

  };

  t.remove.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.delete(general.resource_url('/instances/' + instance.path));

        result.success(function (response, status, headers, config) {

          collections.alerts.length = 0;

          collections.alerts.push({
            type: 'success',
            name: 'Removed',
            msg: multipleResultMsg(response),
          });

        });

      }

      instances.length = 0;

    });

  });

  t.create.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.post(general.resource_url('/instances'), instance);

        result.success(function (response, status, headers, config) {

          if (response.errors) {
            collections.alerts.length = 0;
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            $window.scrollTo(0, 0);
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Created',
            msg: response[0].path,
            keep: true
          });

          $location.path(general.path.parent(response[0].path));

        });

      }

      instances.length = 0;

    });

  });

  t.update.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.put(general.resource_url('/instances'), instance);

        result.success(function (instance, response, status, headers, config) {

          collections.alerts.length = 0;

          if (response.errors) {
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Saved',
            msg: response[0].path,
            keep: instance.path !== response[0].path
          });

          $location.path('/edit/' + response[0].path);
          $window.scrollTo(0, 0);

        }.bind(null, instance));

      }

      instances.length = 0;

    });

  });

  t.copy.on('push', function (instances) {

    $rootScope.$apply(function () {

      var instance;

      while (instance = instances.shift()) {

        var result = $http.post(general.resource_url('/instances/copy'), instance);

        result.success(function (response, status, headers, config) {

          collections.alerts.length = 0;

          if (response.errors) {
            collections.alerts.push.apply(collections.alerts, alerts.flattenValidationErrors(response.errors));
            return;
          }

          collections.alerts.push({
            type: 'success',
            name: 'Copy',
            msg: multipleResultMsg(response),
          });

          collections.instances.push(response[0]);

          collections.instances.sort(function (a, b) {
            return a.sort > b.sort;
          });

        });

      }

    });

  });

  return t;

};

module.exports = factories;
