var kwery = require('kwery');
var core = require('./core');
var express = require('express');

// App

var app = express();
app.use(express.bodyParser());

// Routes

require('./instances/routes').init(app);
require('./types/routes').init(app);

// Export

var jungles_rest = {

  init: function (options) {
    core.data = options.data;
    core.types = { find: kwery.flat.bind(null, options.types) };
    return app;
  }

};

module.exports = jungles_rest;
