var slug = require('slug');
var async = require('async');
var _ = require('underscore');
var utils = require('../utils');

var functions = {

  getInstances: function (state, next) {

    var query = 'SELECT * FROM instances WHERE path ~ $1 ORDER BY sort';

    state.db.query(query, [ utils.escapeForRegex(state.data.path) + '(/|$)' ], function (err, response) {
      state.instances = utils.createInstances(response);
      next(null, state);
    });

  },

  parentData: function (state, next) {

    // Get parent data if parent exists

    if (!state.data.parent) {
      return next(null, state);
    }

    if (state.data.parent === '/') {
      state.parent = {
        path: '/',
        sort: [],
      };

      return next(null, state);
    }

    var query = 'SELECT * FROM instances WHERE path = $1;';

    state.db.query(query, [ state.data.parent ], function (err, response) {
      state.parent = utils.createInstances(response)[0];
      next(null, state);
    });

  },

  targetData: function (state, next) {

    // Instance that's being updated

    var target = JSON.parse(JSON.stringify(state.instances[0]));

    target.name = state.data.name || target.name;
    target.type = state.data.type || target.type;
    target.order = state.data.order || target.order;
    target.sort[target.sort.length - 1] = target.order;

    _.extend(target, utils.pickData(state.data));

    if (state.parent) {
      target.path = (state.parent.path + '/' + slug(target.name).toLowerCase()).replace('//', '/');
      target.sort = state.parent.sort.concat([target.sort[target.sort.length - 1]]);
    } else {
      target.path = target.path.substr(0, target.path.lastIndexOf('/') + 1) + slug(target.name).toLowerCase();
    }

    state.target = target;
    next(null, state);

  },

  instancesData: function (state, next) {

    var base;
    var instances = JSON.parse(JSON.stringify(state.instances));
    var original = instances[0];
    
    instances.forEach(function (instance, i) {

      if (i === 0) {
        instances[i] = state.target;
      } else {
        instance.path = instance.path.replace(new RegExp('^' + utils.escapeForRegex(original.path)), state.target.path);
        instance.sort = state.target.sort.concat(instance.sort.slice(original.sort.length));
      }

    });

    state.data_instances = instances;
    next(null, state);

  },

  updateInstances: function (state, next) {

    var data = _.map(state.data_instances, function (instance, i) {
      return {
        data: instance,
        original: state.instances[i],
      };
    });

    async.map(data, function (d, next) {

      var instance = d.data;
      var original = d.original;

      var params = [
        instance.type,
        instance.path,
        instance.name,
        utils.arrayifiy(instance.sort),
        JSON.stringify(utils.pickData(instance)),
        original.path
      ];

      state.db.query('UPDATE instances set type=$1, path=$2, name=$3, sort=$4, data = $5 where path = $6 RETURNING *;', params, function (err, result) {
        next(err, utils.createInstances(result)[0]);
      });
      
    }, function (err, response) {
      state.stored_instances = response;
      next(null, state);
    });

  }

};

module.exports = functions;
