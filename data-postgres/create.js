var slug = require('slug');
var utils = require('./utils');
var arrayifiy = utils.arrayifiy;
var pickData = utils.pickData;

var create = function (db, data) {

  return {

    success: function (callback) {

      db.query('SELECT * FROM instances where path = $1', [data.parent], function (err, response) {

        var path = '/';
        var sort = [];

        if (response.rows.length !== 0) {
          path = response.rows[0].path;
          sort = response.rows[0].sort;
        }
        
        path = (path + '/' + slug(data.name.toLowerCase())).replace('//', '/');
        sort = [].concat(sort, [ data.order ]);

        var params = [data.type, path, data.name, arrayifiy(sort), JSON.stringify(pickData(data))];

        db.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5) RETURNING *;', params, function (err, response) {
          callback(utils.createInstances(response)[0]);
        });

      });

    }

  };

};

module.exports = create;
