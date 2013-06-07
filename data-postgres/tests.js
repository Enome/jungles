var specs = require('jungles-data');

var data = require('./index')({
  host: '127.0.0.1',
  port: '5432',
  user: 'jungles_test',
  password: '1234',
  database: 'jungles_test',
});

var client = data.client;

client.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {

  data.setup(function (err) {
    
    var test_data = {
      boards: ['category', '/boards', 'Boards', '{0}', JSON.stringify({ color: 'red' })],
      blades: ['category', '/blades', 'Blades', '{1}', JSON.stringify({ color: 'blue' })],
      skateboard: ['product', '/boards/skateboard', 'Skateboard', '{0, 0}', JSON.stringify({})],
      wheel: ['part', '/boards/skateboard/wheel', 'Wheel', '{0, 0, 0}', JSON.stringify({})],
    };

    var settings = {
      bail: true,
      beforeEach: function (done) {
        client.query('BEGIN');
        client.query('DELETE FROM instances');
        client.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5);', test_data.boards);
        client.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5);', test_data.blades);
        client.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5);', test_data.skateboard);
        client.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5);', test_data.wheel);
        client.query('COMMIT', function () { done(); });
      },
    };

    specs(data, settings);

  });

});
