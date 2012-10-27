var controllers = require('./controllers');
var directives = require('./directives');

var app = window.jungles;

app.controller('UploadCtrl', controllers.UploadCtrl);
app.directive('upload', directives.upload);
