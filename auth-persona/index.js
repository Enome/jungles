var express = require('express');
var middleware = require('./middleware');
var general = require('jungles-middleware-general');

module.exports = function () {

  /* urls: string or array with urls that redirect to
           login if req.session.user is undefined. */

  var app = express();

  // Config

  app.use(express.static(__dirname + '/static'));
  app.use(express.bodyParser());
  
  // Base Url

  app.use(function (req, res, next) {
    res.locals.base_url = app.path();
    next();
  });

  // Pass query to views

  app.use(function (req, res, next) {
    res.locals.query = req.query;
    next();
  });


  // Routes

  app.get('/',  general.render(__dirname + '/login.jade'));
  app.post('/', middleware.verify);
  app.get('/logout', middleware.destroy);

  return app;
    
};
