var core = require('../core');
var extend = require('underscore').extend;
var each = require('underscore').each;

module.exports = {

  inject: function (_core) {
    if (_core) { core = _core; }
  },

  defaultQuery: function (req, res, next) {
    if (Object.keys(req.query).length === 0) {
      req.query = { path: /.*/ };
    }
    next();
  },

  queryToRegex: function (req, res, next) {

    each(req.query, function (value, key) {
      if (value.toString().indexOf('regex-') === 0) {
        req.query[key] = new RegExp(value.replace(/^regex-\/|\/$/g, ''));
      }
    });

    next();
  },

  find: function (query) {
    
    return function (req, res, next) {

      var q = query.call({ req: req, res: res });

      var result = core.data.find(q);

      result.many(function (response) {
        res.locals.instances = response;
        next();
      });

    };

  },

  create: function (req, res, next) {

    var result = core.types.create(req.body);

    result.success(function (response) {
      res.locals.response = response;
      next();
    });

    result.error(function (errors) {
      res.json({ errors: errors });
    });

  },

  update: function (req, res, next) {

    var result = core.types.update(req.body);

    result.success(function (response) {
      res.locals.response = response;
      next();
    });

    result.error(function (errors) {
      res.json({ errors: errors });
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
      
      var result = core.schemas.find({ name: item.type });

      result.one(function (type) {
        item.children = type.children || [];
      });

    });
    next();
  }
  
};
