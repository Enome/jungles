var test = require('jungles-data');

var data = require('./index')({
  host: '127.0.0.1',
  port: '5432',
  user: 'jungles_test',
  password: '1234',
  database: 'jungles_test',
});

data.client.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {
  data.setup(function (err) {
    test(data, true);
  });
});
