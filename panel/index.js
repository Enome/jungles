var express = require('express');
var stylus = require('stylus');
var nib = require('nib');

module.exports = function (rest) {

  // App

  var app = express();

  app.locals.pretty = true;

  // Base paths

  app.use(function (req, res, next) {
    res.locals.base_url = app.path();
    res.locals.resource_url = rest;
    next();
  });

  // Middleware

  app.use('/partials', express.static(__dirname + '/client/locals/jungles-panel-core/partials'));
  console.log(__dirname + '/client/build');
  app.use(express.static(__dirname + '/client/build'));

  // Routes
  
  app.get('/', function (req, res, next) {
    var last_char = req.originalUrl.substr(req.originalUrl.length - 1);

    if (last_char !== '/') {
      return res.redirect(301, req.originalUrl + '/');
    }

    res.locals.route_local = 'local';
    res.render(__dirname + '/index.jade');
  });

  return app;

};
