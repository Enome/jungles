module.exports = function (dir) {

  var express = require('express');
  var middleware = require('./middleware');

  var app = express();
  app.use(express.bodyParser());

  require('./directories')(app, dir);
  require('./files')(app, dir);

  // Default

  app.get('/:path(*)',
          middleware.getPaths(dir),
          middleware.validatePaths,
          middleware.serveFile);

  return app;

};
