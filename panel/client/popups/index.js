var controllers = require('./controllers');

var popups = function (jungles) {
  jungles.controller('CopyPopupCtrl', controllers.CopyPopupCtrl);
};

module.exports = popups;
