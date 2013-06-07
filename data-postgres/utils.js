var extend = require('underscore').extend;
var pick = require('underscore').pick;
var difference = require('underscore').difference;

var utils = {

  createInstances: function (result) {

    if (!result.rows) {
      return [];
    }

    var rows = [];

    result.rows.forEach(function (val) {

      if (val.data) {
        var data = JSON.parse(val.data);
        extend(val, data);
        delete val.data;
      }

      val.order = val.sort[val.sort.length - 1];

      delete val.id;

      rows.push(val);

    });

    return rows;

  },

  pickData: function (data) {
    var reserved = [ 'id', 'type', 'path', 'name', 'sort', 'order', 'parent', 'move_to' ];
    return pick(data, difference(Object.keys(data), reserved));
  },


  arrayifiy: function (array) {
    return '{' + array.join(',') + '}';
  }



};

module.exports = utils;
