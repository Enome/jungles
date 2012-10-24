var controllers = require('./controllers');
var directives = require('./directives');

var upload = function (app) {
  app.controller('UploadCtrl', controllers.UploadCtrl);
  app.directive('upload', directives.upload);
};

alert('test');

module.exports = upload;
