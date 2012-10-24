var functions = require('./functions');

var customize = {

  init: function (app, callbacks) {

    app.get('/custom/javascript', function (req, res, next) {

      functions.javascript(callbacks, function (javascript) {
        res.header('Content-type', 'text/javascript');
        res.send(javascript);
      });

    });

    app.get('/custom/css', function (req, res, next) {

      functions.css(callbacks, function (css) {
        res.header('Content-type', 'text/css');
        res.send(css);
      });

    });

    app.get('/custom/html/:name', function (req, res, next) {

      functions.html(callbacks, function (html) {
        res.send(html[req.params.name]);
      });

    });

  }

};

module.exports = customize;
