var controllers = require('./controllers');
var directives = require('./directives');
var filters = require('./filters');

var app = window.jungles;

app.filter('fileType', filters.fileType);
app.controller('UploadCtrl', controllers.UploadCtrl);
app.directive('upload', directives.upload);
