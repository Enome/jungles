var core = require('../core');
var validate = require('jungles-validation');
var extend = require('underscore').extend;
var functions = require('./functions');

module.exports = {

  inject: function (_core, _functions, _validate, _schema) {
    if (_core) { core = _core; }
    if (_functions) { functions = _functions; }
    if (_validate) { validate = _validate; }
  },

  defaultQuery: function (req, res, next) {
    if (Object.keys(req.query).length === 0) {
      req.query = { name: '.*' };
    }
    next();
  },

  find: function (query) {
    
    return function (req, res, next) {

      var q = query.call({ req: req, res: res });

      var result = core.schemas.find(q);

      result.many(function (response) {
        if (response.length !== 0) {
          res.locals.types = response;
          return next();
        }
      });

      result.empty(function () {
        return next({ type: 'types', error: 'No types were found.' });
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

};
