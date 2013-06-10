var controllers = require('./controllers');
var directives = require('./directives');
var filters = require('./filters');

var app = window.jungles;

app.filter('isImage', filters.isImage);
app.filter('fileName', filters.fileName);
app.controller('UploadCtrl', controllers.UploadCtrl);
app.directive('upload', directives.upload);
