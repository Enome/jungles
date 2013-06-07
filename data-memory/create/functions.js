var _ = require('underscore');
var slug = require('slug');
var async = require('async');
var kwery = require('kwery');

var functions = {

  getParent: function (state, next) {

    if (state.data.parent === '/' || 'undefined' === typeof state.data.parent) {
      state.parent = {
        path: '/',
        sort: [],
      };

      return next(null, state);
    }

    var result = kwery.flat(state.db, { path: state.data.parent });

    result.one(function (instance) {
      state.parent = instance;
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
    _.extend(instance, state.data);

    delete instance.parent;

    state.data_instances = [instance];
    next(null, state);

  },

  createInstances: function (state, next) {

    state.db.push.apply(state.db, state.data_instances);
    state.stored_instances = state.data_instances;
    next(null, state);

  },


};

module.exports = functions;
