var validators = require('jungles-validators');
var required = validators.required;
var string = validators.string;
var validate = require('./index');

describe('Validate', function () {

  var data, schema;

  describe('Valid', function () {

    beforeEach(function () {
      data = { name: 'James' };
      schema = { name: [ required(), string() ] };
    });

    it('calls valid', function (done) {

      var result = validate(data, schema);

      result.valid(function (response) {
        response.should.eql({ name: 'James' });
        done();
      });

      result.invalid(function () {
        false.should.be.true;
        done();
      });

    });

  });

  describe('Invalid', function () {

    beforeEach(function () {
      
      data = {
        name: '',
        order: undefined
      };

      schema = {
        name: [ required() ],
        order: [ required() ]
      };

    });

    it('calls valid', function (done) {

      var result = validate(data, schema);

      result.invalid(function (errors) {
        errors.should.eql({
          name: ['String is empty'],
          order: ['String is empty']
        });
        done();
      });

      result.valid(function () {

        false.should.be.true;
        done();

      });


    });

  });

});
