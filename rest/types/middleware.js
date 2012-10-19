var core = require('../core');
var validate = require('jungles-validation');
var extend = require('underscore').extend;
var schema = require('./schema');
var functions = require('./functions');

module.exports = {

  inject: function (_core, _functions, _validate, _schema) {
    if (_core) { core = _core; }
    if (_functions) { functions = _functions; }
    if (_validate) { validate = _validate; }
    if (_schema) { schema = _schema; }
  },

  find: function (query) {
    
    return function (req, res, next) {

      var q = query.call({ req: req, res: res });

      if (Object.keys(q).length === 0) {
        q = { name: '.*' };
      }

      var result = core.types.find(q);

      result.many(function (response) {
        res.locals.types = response;
        return next();
      });

      result.empty(function () {
        next({ type: 'http', error: 404 });
      });

    };

  },

  renderForm: function (req, res, next) {

    var type = res.locals.types[0];

    functions.renderForm(req.app.parent, type, function (err, str) {

      if (err) {
        return next({ type: 'template', error: err });
      }

      res.locals.form = str;

      return next();

    });

  },

  validate: function (req, res, next) {

    var rules;
    var type = res.locals.types[0];
    
    if (type.schema) {
      rules = extend({}, schema, type.schema);
    }

    var result = validate(req.body, rules || schema);

    result.valid(function (response) {
      res.locals.data = response;
      return next();
    });

    result.invalid(function (errors) {
      res.json({ errors: errors });
    });

  }

};
