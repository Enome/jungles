var core = require('../core');
var extend = require('underscore').extend;
var each = require('underscore').each;

module.exports = {

  inject: function (_core) {
    if (_core) { core = _core; }
  },

  find: function (query) {
    
    return function (req, res, next) {

      var q = query.call({ req: req, res: res });

      if (Object.keys(q).length === 0) {
        q = { path: '.*' };
      }

      var result = core.data.find(q);

      result.many(function (response) {
        res.locals.instances = response;
        next();
      });

    };

  },

  create: function (req, res, next) {

    var result = core.data.create(res.locals.data);

    result.success(function (response) {
      res.locals.response = response;
      next();
    });

  },

  update: function (req, res, next) {

    var result = core.data.update(res.locals.data);

    result.success(function (response) {
      res.locals.response = response;
      next();
    });

  },

  remove: function (req, res, next) {

    var result = core.data.remove({ path: req.params.path });
    result.success(function () {
      next();
    });

  },

  addChildTypes: function (req, res, next) {
    
    res.locals.instances.forEach(function (item) {
      
      var result = core.types.find({ name: item.type });

      result.one(function (type) {
        item.children = type.children || [];
      });

    });
    next();
  }
  
};
