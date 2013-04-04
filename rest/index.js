var jungles_rest = {

  init: function (options) {

    var kwery = require('kwery');
    var core = require('./core');
    var express = require('express');
    var types = require('jungles-types');

    // App

    var app = express();
    app.use(express.bodyParser());

    // Depdencies

    core.data = options.data;
    core.schemas = { find: kwery.flat.bind(null, options.types) };
    core.types = types(options.types, options.data);
    app.core = core;

    // Routes

    require('./instances/routes').init(app);
    require('./types/routes').init(app);

    // Exports

    return app;

  }

};

module.exports = jungles_rest;
