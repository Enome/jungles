var controllers = require('./controllers');

var actions = function (app) {
  app.controller('InstancesActionCtrl', controllers.InstancesActionCtrl);
};

module.exports = actions;
