var types = [];

var factories = function () {

  return {

    set: function (data) {
      types.push.apply(types, data);
    },

    get: function (name) {
      return types.filter(function (type) {
        return type.name === name;
      })[0];
    },

  };

};

module.exports = factories;
