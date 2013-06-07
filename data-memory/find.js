var kwery = require('kwery');

module.exports = function (objects, opts) {
  
  var result = kwery.flat(objects, opts);
  var many = result.many;
  
  // Proxy many to add sort

  result.many = function (callback) {
    
    many(function (response) {
      var sorted = response.sort(function (a, b) {
        return a.sort > b.sort;
      });

      sorted = JSON.parse(JSON.stringify(sorted));

      callback(sorted);
    });

  };

  return result;

};
