var app = require('./app');

var panel = {
  init: function (options) {
    return app(options);
  }
};

module.exports = panel;
