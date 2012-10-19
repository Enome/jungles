var Client = require('pg').Client;

var client = new Client({
  user: 'jungles_test',
  password: '1234',
  database: 'jungles_test',
  host: '127.0.0.1'
});

client.connect();

module.exports = client;
