var create = require('./create');
var update = require('./update');
var copy = require('./copy');

var types = function (settings, datalayer) {
  datalayer.create = create(settings, datalayer);
  datalayer.update = update(settings, datalayer);
  datalayer.copy = copy(settings, datalayer);

  return datalayer;
};

module.exports = types;
