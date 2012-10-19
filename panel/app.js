var express = require('express');
var stylus = require('stylus');

module.exports = function (url) {

  // App

  var app = express();
  
  // Settings

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // Base paths

  app.use(function (req, res, next) {
    res.locals.base_url = app.path();
    res.locals.resource_url = url;
    next();
  });

  // Middleware

  app.use(stylus.middleware({
    src: __dirname + '/assets/src/',
    dest: __dirname + '/assets/public/'
  }));

  app.use(express.static(__dirname + '/assets/public'));
  app.use('/partials', express.static(__dirname + '/client/partials'));


  // Helpers

  //require('./instances/helpers').init(app);


  // Routes

  require('./client/routes').init(app);

  return app;

};
