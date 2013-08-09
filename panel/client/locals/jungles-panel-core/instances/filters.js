var filters = {

  selected: function (collections) {

    return function (input) {
      var current = collections.selected.find(input.path);

      if (current) {
        return 'selected';
      }

      return '';
    };

  },


};

module.exports = filters;
