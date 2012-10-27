var browserify = require('browserify');
var b = browserify();

b.addEntry(__dirname + '/client/index.js');

var upload = function (callback) {
  callback(null, { css: require('./style'), javascript: b.bundle() });
};

module.exports = upload;
