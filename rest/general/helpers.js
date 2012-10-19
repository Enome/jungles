var helpers = {

  init: function (app) {

    app.use(function (req, res, next) {
      res.locals.base_url = app.path();
      next();
    });

  }

};

module.exports = helpers;
