var browserify = require('browserify');
var b = browserify();
b.addEntry(__dirname + '/client/index.js');

var upload = function (callback) {
  callback(null, { javascript: b.bundle() });
};

module.exports = upload;
