var utils = require('./utils');

var dump = function (db, callback) {

  var query = 'SELECT * FROM instances ORDER BY sort';

  db.query(query, [], function (err, result) {
    callback(utils.createInstances(result));
  });

};

module.exports = dump;
