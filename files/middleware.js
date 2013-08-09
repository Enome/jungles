var fs = require('fs');
var path = require('path');
var async = require('async');
var rimraf = require('rimraf');

var functions = require('./functions');

var middleware = {

  getPaths: function (directory) {

    return function (req, res, next) {

      var relative_path = functions.sanitize(req.params.path || req.body.path);
      var absolute_path = directory + relative_path;

      res.locals.relative_path = relative_path;
      res.locals.absolute_path = absolute_path;

      next();

    };

  },

  validatePaths: function (req, res, next) {

    var re = new RegExp('^' + res.locals.absolute_path.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + '($|/)');

    if (!re.test(path.normalize(res.locals.absolute_path))) {
      return next(403);
    }

    next();

  },

  isFile: function (req, res, next) {

    fs.stat(res.locals.absolute_path, function (err, response) {

      if (err) {
        return next(err);
      }

      if (response.isFile()) {
        return next('route');
      }

      next();

    });

  },

  serveFile: function (req, res) {
    res.sendfile(res.locals.absolute_path);
  },

  readDirectory: function (req, res, next) {

    fs.readdir(res.locals.absolute_path, function (err, response) {
      res.locals.files_and_directories = response.filter(function (item) {
        return item.charAt(0) !== '.';
      });
      next(err);
    });

  },

  createStats: function (req, res, next) {

    var absolute_paths = res.locals.files_and_directories.map(function (path) {
      return res.locals.absolute_path + '/' + path;
    });

    async.map(absolute_paths, fs.stat, function (err, response) {
      res.locals.stats = response;
      next(err);
    });

  },

  mergePathsAndStats: function (req, res, next) {

    res.locals.names_and_stats = [];

    res.locals.files_and_directories.forEach(function (name, i) {

      res.locals.names_and_stats.push({
        name: name,
        stat: res.locals.stats[i],
      });

    });

    next();

  },

  filterDirectories: function (req, res, next) {

    res.locals.directories = res.locals.names_and_stats.filter(function (name_and_stat) {
      return name_and_stat.stat.isDirectory();
    });

    next();

  },

  filterFiles: function (req, res, next) {

    res.locals.files = res.locals.names_and_stats.filter(function (name_and_stat) {
      return name_and_stat.stat.isFile();
    });

    next();

  },

  pathExists: function (req, res, next) {

    fs.exists(res.locals.absolute_path + '/' + (req.body.name || req.files.file.name), function (b) {

      if (b) {
        return res.send(500);
      }

      next();

    });

  },

  createDirectory: function (req, res, next) {

    res.locals.path = res.locals.absolute_path + '/' + req.body.name;

    fs.mkdir(res.locals.path, function (err) {
      next(err);
    });

  },

  createFile: function (req, res, next) {

    var path = res.locals.absolute_path + '/' + req.files.file.name;

    fs.rename(req.files.file.path, path, function (err, response) {
      res.send(err, 200);
    });

  },

  removeDirectory: function (req, res, next) {

    rimraf(res.locals.absolute_path, function (err) {
      next(err);
    });

  },

  removeFile: function (req, res, next) {

    fs.unlink(res.locals.absolute_path, function (err) {
      next(err);
    });

  },

  updateDirectory: function (req, res, next) {

    fs.rename(res.locals.absolute_path + '/' + req.body.old_name, res.locals.absolute_path + '/' + req.body.name, function (err) {
      next(err);
    });

  },

};

module.exports = middleware;
