var kwery = require('kwery').flat;
var extend = require('underscore').extend;
var slug = require('slug');

var update = function (db, data) {

  return {

    success: function (callback) {

      var result = kwery(db, { path: data.path });

      result.one(function (response) {

        extend(response, data);

        var old_path = response.path;
        var old_sort = response.sort;

        // remove last part
        
        var base_path = response.parent || old_path.replace(/\/[^\/]+$/, '');
        delete response.parent;
        var base_sort = old_sort.slice(0, old_sort.length - 1);

        // Add new last part
        
        response.path = (base_path + '/' + slug(response.name.toLowerCase())).replace('//', '/');
        base_sort[base_sort.length] = response.order ? parseInt(response.order, 10) : response.sort[response.sort.length - 1];
        response.sort = base_sort;

        // Make a copy for output

        var copy = JSON.parse(JSON.stringify(response));

        // Update children
        
        var result = kwery(db, { path: new RegExp(old_path + '/.*') });

        result.many(function (many) {

          many.forEach(function (instance) {
            instance.path = instance.path.replace(new RegExp('^' + old_path), response.path);
            instance.sort[response.sort.length - 1] = response.order;
          });

          delete copy.sort;
          callback(copy);

        });

      });

    }

  };

};

module.exports = update;
