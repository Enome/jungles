var fs = require('fs');
var uuid = require('node-uuid');
var express = require('express');
var functions = require('jungles-functions');

var files = function (dir) {

  var app = express();

  app.use(express.bodyParser());

  app.post('/:filename', function (req, res) {

    var data_url = req.body.file;
    var base64_data = data_url.replace(/^[^,]+/, '');
    var filename = req.params.filename;
    var buffer = new Buffer(base64_data, 'base64');
    var file_name = uuid.v4() + filename;

    fs.writeFile(dir + '/' + file_name, buffer, function (err) {
      res.send({ file: file_name });
    });

  });

  app.get('/:filename', function (req, res) {
    var crs = fs.createReadStream(dir + '/' + req.params.filename);
    res.header('Content-Disposition', 'attachment; filename=' + functions.getFilename(req.params.filename));
    crs.pipe(res);
  });

  return app;

};

module.exports = files;
