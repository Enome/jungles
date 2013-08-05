var functions = require('./functions');
var express = require('express');

var customize = {

  init: function (app, components) {

    var javascript, css;

    functions.javascript(components, function (string) {
      javascript = string;
    });

    functions.css(components, function (string) {
      css = string;
    });

    components.forEach(function (component) {
      if (component.assets) {
        app.use('/custom/assets/' + component.name, express.static(component.assets));
      }
    });

    app.get('/custom/javascript', function (req, res, next) {
      res.header('Content-type', 'text/javascript');
      res.send(javascript);
    });

    app.get('/custom/css', function (req, res, next) {
      res.header('Content-type', 'text/css');
      res.send(css);
    });

  }

};

module.exports = customize;
