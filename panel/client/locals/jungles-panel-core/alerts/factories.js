var factories = function () {

  return {

    flattenValidationErrors: function (errors) {

      var i;
      var flat = [];

      for (i in errors) {

        if (errors.hasOwnProperty(i)) {

          flat.push({
            type: 'error',
            name: i,
            msg: errors[i].join(', ')
          });

        }

      }

      return flat;

    }

  };

};

module.exports = factories;
