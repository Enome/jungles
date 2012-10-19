var app = require('./app');

var panel = {
  init: function (path) {
    return app(path);
  }
};

module.exports = panel;
