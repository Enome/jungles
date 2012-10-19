var kwery = require('kwery');
var walkSubstack = require('./functions').walkSubstack;

var middleware = {

  inject: function (_walkSubstack) {
    if (walkSubstack) { walkSubstack = _walkSubstack; }
  },

  tree: function (data) {

    return function (req, res, next) {

      var result = data.tree({ path: /.*/ });

      result.success(function (response) {

        res.locals.tree = response;
        next();

      });

    };

  },

  current: function (req, res, next) {

    var result = kwery.tree(res.locals.tree, { path: req.params.path });
    
    result.one(function (instance) {
      res.locals.current = instance;
      next();
    });

    result.empty(function () {
      next({ type: 'http', error: 404 });
    });

  },

  type: function (types) {

    return function (req, res, next) {

      var result = types.find({ name: res.locals.current.type });

      result.one(function (type) {
        res.locals.type = type;
        next();
      });

      result.empty(function () {
        next({ type: 'core', error: 'Type was not found' });
      });
    };

  },

  middleware: function (req, res, next) {

    var type = res.locals.type;

    if (type.middleware) {
      return walkSubstack(type.middleware, req, res, next);
    }

    next();

  },

  render: function (req, res, next) {

    var type = res.locals.type;

    if (req.query.json === 'true') {
      return res.json(res.locals.current);
    }

    res.render(type.name);
         
  }

};

module.exports = middleware;
