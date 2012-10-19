var routes = {

  init: function (app) {
    app.get('/', function (req, res, next) {
      res.locals.route_local = 'local';
      res.render('index');
    });
  }

};

module.exports = routes;
