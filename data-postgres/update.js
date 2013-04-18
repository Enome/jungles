var slug = require('slug');
var utils = require('./utils');
var extend = require('underscore').extend;
var arrayifiy = utils.arrayifiy;
var pickData = utils.pickData;
var find = require('./find');

var update = function (db, data) {

  return {

    success: function (callback) {

      var query = db.query('select * from instances where path = $1', [data.path], function (err, result) {

        var instance = result.rows[0];
        var old_data = JSON.parse(instance.data); delete instance.data;
        var row = extend({}, instance, old_data, data);

        // Path
        
        var slug_name = (slug(row.name.toLowerCase())).replace('//', '/');

        var base_path = row.path.replace(/\/[^\/]+$/, '');
        row.path = (row.parent || base_path) + '/' + slug_name;

        // Sort

        if (typeof row.order !== 'undefined') {
          row.sort[row.sort.length - 1] = row.order;
        }

        // Update record
        
        var params = [row.type, row.path, row.name, arrayifiy(row.sort), JSON.stringify(pickData(row)), instance.path];

        db.query('UPDATE instances set type=$1, path=$2, name=$3, sort=$4, data = $5 where path = $6 RETURNING *;', params, function (err, result) {

          // Update children
      
          var params = [ '^' + data.path + '/', row.path + '/', row.sort.length, row.sort[row.sort.length - 1], data.path + '/%' ];
          var query = "update instances set path=regexp_replace(path, $1, $2), sort[$3]=$4 where path like $5;";

          db.query(query, params, function (err, child_result) {

            callback(utils.createInstances(result)[0]);

          });


        });

      });

    }

  };

};

module.exports = update;
