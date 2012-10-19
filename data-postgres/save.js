var find = require('./find');
var slug = require('slug');
var extend = require('underscore').extend;
var filter = require('underscore').filter;
var pick = require('underscore').pick;
var difference = require('underscore').difference;

var arraifiy = function (array) {
  return '{' + array.join(',') + '}';
};

var reserved = [ 'id', 'type', 'path', 'name', 'sort', 'arrange', 'parent' ];

var pickData = function (data) {
  return pick(data, difference(Object.keys(data), reserved));
};

var create = function (db, data, callback) {

  db.query('SELECT * FROM instances where id = $1', [data.parent], function (err, response) {

    var path = '/';
    var sort = [];

    if (response.rows.length !== 0) {
      path = response.rows[0].path;
      sort = response.rows[0].sort;
    }
    
    path = (path + '/' + slug(data.name.toLowerCase())).replace('//', '/');
    sort = [].concat(sort, [ data.arrange ]);

    db.query('INSERT INTO instances(type, path, name, sort, data) values($1, $2, $3, $4, $5);',
             [data.type, path, data.name, arraifiy(sort), JSON.stringify(pickData(data))]);
    callback();

  });

};

var update = function (db, data, callback) {

  var query = find(db, { id: data.id });

  query.one(function (result) {

    var row = extend({}, result, data);

    var old_path = row.path;
    var old_sort = row.sort;

    // remove last part
    
    var base_path = old_path.replace(/\/[^\/]+$/, '');
    var base_sort = old_sort.slice(0, old_sort.length - 1);

    // Add new last part
    
    var current_path = (base_path + '/' + slug(row.name.toLowerCase())).replace('//', '/');
    var current_sort = row.sort;

    if (typeof row.array !== 'undefined') {
      current_sort = [].concat(base_sort, [row.arrange]);
    }

    // Update record
    
    db.query('UPDATE instances set type=$1, path=$2, name=$3, sort=$4, data = $5 where id = $6;', [row.type, current_path, row.name, arraifiy(current_sort), JSON.stringify(pickData(row)), row.id], function (err, result) {

      // Update children
  
      db.query('SELECT * from instances where path LIKE $1 and id != $2', [ old_path + '%', row.id ], function (err, result) {

        var rows = result.rows;


        rows.forEach(function (instance) {

          var path = instance.path.replace(new RegExp('^' + old_path), current_path);
          var sort = [].concat(old_sort, [instance.sort.pop()]);

          db.query({
            name: 'update child',
            text: 'UPDATE instances set sort=$1, path=$2 where id = $3;',
            values: [ arraifiy(sort), path, instance.id ]
          });

        });

        callback();

      });

    });

  });

};

module.exports = function (db, data) {

  return {

    success: function (callback) {

      if (typeof data.id !== 'undefined') {
        update(db, data, callback);
      } else {
        create(db, data, callback);
      }

    }

  };

};
