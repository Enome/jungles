var factories = require('./factories');
var controllers = require('./controllers');

var move = function (app) {
  app.factory('clipboard', factories);
  app.controller('ClipboardCtrl', controllers.ClipboardCtrl);
  app.controller('ClipboardInstanceCtrl', controllers.ClipboardInstanceCtrl);
  app.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = move;
