var types = require('../types/middleware');
var general = require('jungles-middleware-general');
var instances = require('./middleware');
var _ = require('underscore');

module.exports = {
  
  init: function (app) {

    app.get('/instances',
            instances.defaultQuery,
            instances.queryToRegex,
            instances.find(function () { return this.req.query; }),
            general.send(function () { return this.res.locals.instances; }));

    app.post('/instances',
             instances.create,
             general.send(function () { return this.res.locals.response; }));

    app.post('/instances/copy',
             instances.copy,
             general.send(function () { return this.res.locals.response; }));

    app.put('/instances',
             instances.update,
             general.send(function () { return this.res.locals.response; }));

    app.del('/instances/:path(*)',
             instances.remove,
             general.send(function () { return this.res.locals.response; }));

  }

};
