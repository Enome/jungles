var express = require('express');
var functions = require('./functions');

var auth_simple = function (login_url, admins) {

  if (!Array.isArray(admins)) {
    admins = [admins];
  }

  var app = express();

  app.use(function (req, res, next) {

    if (!req.session) {
      throw 'Simple auth needs to have sessions enabled';
    }

    var i;

    for (i = 0; i < admins.length; i += 1) {
      if (req.session.user === admins[i]) {
        return next();
      }
    }
    
    res.redirect(login_url + '?redirect_url=' + functions.figureoutRedirect(req));

  });


  return app;

};

module.exports = auth_simple;
