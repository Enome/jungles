var factories = require('../factories');

describe('factories', function () {

  describe('flattenValidationErrors', function () {

    it('flattens the validation errors', function () {

      var errors = {
        name: [ 'Should be unique', 'Is empty' ],
        body: [ 'Is empty' ],
      };

      factories().flattenValidationErrors(errors).should.eql([
        {
          type: 'error',
          name: 'name',
          msg: 'Should be unique, Is empty'
        },
        {
          type: 'error',
          name: 'body',
          msg: 'Is empty'
        }
      ]);

    });

  });

});
