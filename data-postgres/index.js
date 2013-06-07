var pg = require('pg');

module.exports = function (settings) {

  var client = new pg.Client(settings);
  client.connect();

  var data = {
    dump: require('./dump').bind(null, client),
    find: require('./find').bind(null, client),
    tree: require('./tree').bind(null, client),
    create: require('./create').bind(null, client),
    remove: require('./remove').bind(null, client),
    update: require('./update').bind(null, client),
    copy: require('./copy').bind(null, client),
    setup: require('./setup').bind(null, client),
    client: client
  };

  return data;

};
