var pg = require('pg');

module.exports = function (settings) {

  var client = new pg.Client(settings);

  client.connect();

  return {
    find: require('./find').bind(null, client),
    tree: require('./tree').bind(null, client),
    save: require('./save').bind(null, client),
    remove: require('./remove').bind(null, client),
    setup: require('./setup').bind(null, client),
    client: client
  };

};
