var types = require('../types/middleware');
var general = require('jungles-middleware-general');
var instances = require('./middleware');
var _ = require('underscore');

module.exports = {
  
  init: function (app) {

    app.get('/instances',
            instances.find(function () { return this.req.query; }),
            instances.addChildTypes,
            general.send(function () { return this.res.locals.instances; }));

    app.post('/instances',
             types.find(function () { return { name: this.req.body.type }; }),
             types.validate,
             instances.create,
             general.send(function () { return this.res.locals.response; }));

    app.put('/instances',
             types.find(function () { return { name: this.req.body.type }; }),
             types.validate,
             instances.find(function () { return { path: this.req.body.path }; }),
             instances.update,
             general.send(function () { return this.res.locals.response; }));

    app.del('/instances/:path(*)',
             instances.remove,
             general.send(function () { return { path: this.req.params.path }; }));

  }

};
