var create = require('./create');
var update = require('./update');

var types = function (settings, datalayer) {
  datalayer.create = create(settings, datalayer);
  datalayer.update = update(settings, datalayer);

  return datalayer;
};

module.exports = types;
