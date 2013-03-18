var functions = require('./functions');

var customize = {

  init: function (app, components) {

    var javascript, css;

    functions.javascript(components, function (string) {
      javascript = string;
    });

    functions.css(components, function (string) {
      css = string;
    });

    app.get('/custom/javascript', function (req, res, next) {
      res.header('Content-type', 'text/javascript');
      res.send(javascript);
    });

    app.get('/custom/css', function (req, res, next) {
      res.header('Content-type', 'text/css');
      res.send(css);
    });

    app.get('/custom/assets/:component/:name', function (req, res, next) {
      res.sendfile(functions.assets(components, req.params.component, req.params.name));
    });

  }

};

module.exports = customize;
