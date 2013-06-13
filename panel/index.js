var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

module.exports = function (options) {

  // App

  var app = express();

  // Base paths

  app.use(function (req, res, next) {
    res.locals.base_url = app.path();
    res.locals.resource_url = options.url;
    next();
  });

  // Middleware

  app.use(stylus.middleware({
    src: __dirname + '/static/src',
    dest: __dirname + '/static/public',
    compile: function (str, path) {
      return stylus(str).set('filename', path).use(nib());
    }
  }));

  app.use(express.static(__dirname + '/static/public'));
  app.use('/partials', express.static(__dirname + '/client/partials'));

  // Customize

  require('./customize').init(app, options.customize);

  // Routes

  require('./client/routes').init(app);

  return app;

};
