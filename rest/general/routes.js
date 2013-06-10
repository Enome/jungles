var middleware = require('./middleware');

var routes = {

  init: function (app) {
    app.use(middleware.noCache);
  }

};

module.exports = routes;
