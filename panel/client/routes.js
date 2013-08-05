var routes = {

  init: function (app) {

    app.get('/', function (req, res, next) {
      var last_char = req.originalUrl.substr(req.originalUrl.length - 1);

      if (last_char !== '/') {
        return res.redirect(301, req.originalUrl + '/');
      }

      res.locals.route_local = 'local';
      res.render(__dirname + '/index.jade');
    });
  }

};

module.exports = routes;
