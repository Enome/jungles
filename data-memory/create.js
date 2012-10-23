var kwery = require('kwery').flat;
var slug = require('slug');

var create = function (db, data) {

  return {

    success: function (callback) {

      var result = kwery(db, { path: data.parent });

      result.many(function (response) {

        delete data.parent;

        var base_path = '/';
        var base_sort = [];

        if (response.length !== 0) {
          base_path = response[0].path;
          base_sort = response[0].sort.slice(0); // copy
        }
        
        data.path = (base_path + '/' + slug(data.name.toLowerCase())).replace('//', '/');
        base_sort[base_sort.length] = data.order;
        data.sort = base_sort;

        db.push(JSON.parse(JSON.stringify(data)));

        delete data.sort;

        callback(data);
                        
      });

    }

  };

};

module.exports = create;
