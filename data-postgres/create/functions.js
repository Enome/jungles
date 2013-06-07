var _ = require('underscore');
var slug = require('slug');
var async = require('async');
var utils = require('../utils');

var functions = {

  getParent: function (state, next) {

    if (state.data.parent === '/' || 'undefined' === typeof state.data.parent) {
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

    var instance = {
      name: state.data.name,
      type: state.data.type,
      order: state.data.order,
      sort: state.parent.sort,
      path: state.parent.path,
    };

    instance.sort.push(instance.order);
    instance.path = (instance.path + '/' + slug(instance.name).toLowerCase()).replace('//', '/');
    _.extend(instance, utils.pickData(state.data));

    state.data_instances = [instance];
    next(null, state);

  },

  createInstances: function (state, next) {

    async.map(state.data_instances, function (instance, next) {

      var params = [
        instance.type,
        instance.path,
        instance.name,
        utils.arrayifiy(instance.sort),
        JSON.stringify(utils.pickData(instance)),
      ];

      state.db.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5) RETURNING *;', params, function (err, result) {
        next(err, utils.createInstances(result)[0]);
      });
      
    }, function (err, response) {
      state.stored_instances = response;
      next(null, state);
    });

  },

};

module.exports = functions;
