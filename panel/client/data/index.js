var factories = require('./factories');

var data = function (app) {
  app.factory('data', factories);
};

module.exports = data;
