var express = require('express');
var middleware = require('./src/middleware');
var general = require('jungles-middleware-general');

module.exports = {

  init: function (urls) {

    /* urls: string or array with urls that redirect to
             login if req.session.user is undefined. */

    var app = express();

    // Config

    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.use('/auth', express.static(__dirname + '/static'));
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret: "IFohCiec4XeelaengobiCaichae2iedohR1ahHai6oagheifee" }));
    app.use(express.bodyParser());

    // Pass query to views

    app.use(function (req, res, next) {
      res.locals.query = req.query;
      next();
    });

    // One or more url
    
    if (!Array.isArray(urls)) {
      urls = [ urls ];
    }

    // Routes

    urls.forEach(function (url) {
      app.all(url, middleware.requireUser);
    });

    app.get('/login',  general.render('login'));
    app.post('/login', middleware.verify);
    app.get('/logout', middleware.destroy);

    return app;
    
  }

};
