var fs = require('fs');

module.exports = function (client, cb) {

  var init = function (callback) {

    fs.readFile(__dirname + '/schemas/init.sql', function (err, result) {

      if (err) {
        return callback(err);
      }

      client.query(result.toString(), function (err, result) {

        if (err && err.detail !== 'Key (key)=(version) already exists.') {
          return callback(err);
        }

        callback();

      });

    });

  };

  var execute_script = function (id, callback) {

    var schema = id + '.sql';
    var path = __dirname + '/schemas/' + schema;

    fs.stat(path, function (err) {

      if (err) {
        console.log('Database schema up to date.');
        return cb && cb();
      }

      fs.readFile(path, function (err, result) {

        if (err) {
          return callback(err);
        }

        client.query(result.toString(), function (err, result) {

          if (err) {
            return callback(err);
          }

          console.log('Executed schema: ' + schema);

          callback();

        });

      });

    });

  };

  init(function (err) {

    if (err) {
      return console.log(err);
    }

    client.query("SELECT value FROM settings WHERE key = 'version'", function (err, result) {

      var version = result.rows[0].value;
      var start = parseInt(version, 10) + 1;

      var callback = function (err) {

        if (err) {
          return console.log(err);
        }

        execute_script(start += 1, callback);

      };

      execute_script(start, callback);

    });
      
  });

};
