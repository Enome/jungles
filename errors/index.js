var express = require('express');
var error_list = require('./error_list');

var errors = function (app, view) {

  app.all('*', function (req, res, next) {
    next({ type: 'http', error: 404 });
  });

  app.use(function (err, req, res, next) {

    var code;
    var stack;

    if (err.type === 'http') {
      code = err.error;
    } else {
      code = 500;
    }

    if (err) {
      stack = err.stack || JSON.stringify(err, null, 2);
    }

    console.log(new Date());
    console.log(stack);
    console.log('code: ' + code);
    console.log('url: ' + req.url);
    console.log('--------------------------------------------------');

    res.locals.error_list = error_list;
    res.locals.code = code;
    res.locals.url = req.url;
    res.statusCode = code;

    res.render(view || __dirname + '/index.jade');

  });

};

module.exports = errors;
