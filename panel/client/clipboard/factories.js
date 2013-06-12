var factories = function (collections) {

  
  return {

    clear: function (instance) {

      collections.clipboard.forEach(function (instance, i) {
        if (collections.clipboard[i].path === instance.path) {
          collections.clipboard.splice(i, 1);
        }
      });

    }

  };

};

module.exports = factories;
