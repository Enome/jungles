var app = require('./app');

var panel = {

  init: function (path) {

    return {
      app: app(path)
    };

  }

};

module.exports = panel;
