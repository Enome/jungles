var general = require('jungles-middleware-general');
var middleware = require('./middleware');

var routes = {
  
  init: function (app) {

    app.get('/types',
            middleware.defaultQuery,
            middleware.find(function () { return this.req.query; }),
            general.send(function () { return this.res.locals.types; }));

    app.get('/types/:name/form',
            middleware.find(function () { return { name: this.req.param('name') }; }),
            middleware.renderForm,
            general.send(function () { return this.res.locals.form; }));

  }

};

module.exports = routes;
