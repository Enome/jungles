var slug = require('slug');
var async = require('async');
var _ = require('underscore');
var kwery = require('kwery');

var functions = {

  getInstances: function (state, next) {

    var result = kwery.flat(state.db, { path: new RegExp('^' + state.data.path + '(/|$)') });

    result.many(function (instances) {
      state.instances = instances;
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

    var result = kwery.flat(state.db, { path: state.data.parent });

    result.one(function (instance) {
      state.parent = instance;
      next(null, state);
    });

  },

  targetData: function (state, next) {

    // Instance that's being updated

    var target = JSON.parse(JSON.stringify(state.instances[0]));

    _.extend(target, state.data);
    target.order = state.data.order || target.sort[target.sort.length - 1];
    target.sort[target.sort.length - 1] = target.order;

    delete target.parent;

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
        instance.path = instance.path.replace(new RegExp('^' + original.path), state.target.path);
        instance.sort = state.target.sort.concat(instance.sort.slice(original.sort.length));
      }

    });

    state.data_instances = instances;
    next(null, state);

  },

  updateInstances: function (state, next) {

    var stored_instances = [];

    state.data_instances.forEach(function (instance, i) {
      stored_instances.push(_.extend(state.instances[i], instance));
    });

    state.stored_instances = stored_instances;
    next(null, state);

  },

};

module.exports = functions;
