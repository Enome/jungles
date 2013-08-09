var middleware = require('./middleware');

var files = function (app, dir) {

  var getPaths = middleware.getPaths(dir);

  app.get('/files/:path(*)',
          getPaths,
          middleware.validatePaths,
          middleware.isFile, // skip to next route
          middleware.readDirectory,
          middleware.createStats,
          middleware.mergePathsAndStats,
          middleware.filterFiles,
          function (req, res) {
            res.json(res.locals.files.map(function (file) {
              return {
                name: file.name,
                path: res.locals.relative_path + '/' + file.name,
              };
            }));
          });

  app.get('/files/:path(*)', middleware.serveFile);

  app.post('/files/:path(*)', 
           getPaths,
           middleware.validatePaths,
           middleware.pathExists,
           middleware.createFile,
           function (req, res) {
             res.json({
               name: req.body.name,
               path: res.locals.relative_path + '/' + req.body.name,
             });
           });

  app.del('/files/:path(*)',
            getPaths,
            middleware.validatePaths,
            middleware.removeFile,
            function (req, res) {
              res.send(200);
            });

  app.put('/files/',
            getPaths,
            middleware.validatePaths,
            middleware.pathExists,
            middleware.updateDirectory,
            function (req, res) {
              res.json({
                name: req.body.name,
                path: res.locals.relative_path + '/' + req.body.name,
              });
            });
};

module.exports = files;
