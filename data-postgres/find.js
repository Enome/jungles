var kwery = require('kwery');
var each = require('underscore').each;
var EventEmitter = require('events').EventEmitter;
var extend = require('underscore').extend;

module.exports = function (db, query_object) {

  var conditionals = [];
  var values = [];

  var i = 0;

  each(query_object, function (value, key) {
    var op = '=';

    if (value instanceof RegExp) {
      op = '~';
      value = value.toString();
      value = value.substring(1, value.length - 1);
    }

    conditionals.push(key + ' ' + op + ' $' + (i + 1));
    values.push(value);

    i += 1;
  });


  var ee = new EventEmitter();

  var query = 'SELECT * FROM instances WHERE ' + conditionals.join(' and ') + 'ORDER BY sort';

  process.nextTick(function () {

    db.query(query, values, function (err, result) {

      if (err) {
        return ee.emit('error', err);
      }

      var rows = [];

      result.rows.forEach(function (val) {

        if (val.data) {
          var data = JSON.parse(val.data);
          extend(val, data);
          delete val.data;
        }

        val.arrange = val.sort[val.sort.length - 1];

        rows.push(val);

      });

      ee.emit('many', rows);

      if (rows.length === 0) {
        ee.emit('empty');
      } else {
        ee.emit('one', rows[0]);
      }

    });

  });

  return {
    
    many: ee.on.bind(ee, 'many'),
    one: ee.on.bind(ee, 'one'),
    empty: ee.on.bind(ee, 'empty'),
    error: ee.on.bind(ee, 'error')

  };

};
