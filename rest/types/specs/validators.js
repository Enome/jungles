var validators = require('../validators');
var kwery = require('kwery');
var uniqueName = validators.uniqueName;

describe('Validators', function () {

  var errors, sanitize;

  beforeEach(function () {

    errors = {};
    sanitize = {};

  });

  describe('Valid', function () {

    describe('Unique', function () {
      
      it('adds no error when name property isnt unique within its parent', function () {


        var data_layer = {
          find: kwery.flat.bind(null, [
            {
              name: 'products',
              path: '/products',
            }
          ]),
        };

        var validator = uniqueName(data_layer);

        var data = {
          name: 'home',
          parent: '/',
        };

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
        });

      });

      it('adds no error when there are no matching results', function () {


        var data_layer = {
          find: kwery.flat.bind(null, []),
        };

        var validator = uniqueName(data_layer);

        var data = {
          name: 'home',
          parent: '/',
        };

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
        });

      });

    });

  });

  describe('Invalid', function () {

    describe('Unique', function () {
      
      it('adds an error when name property isnt unique within its parent', function () {


        var data_layer = {
          find: kwery.flat.bind(null, [
            {
              name: 'home',
              path: '/home',
            }
          ]),
        };

        var validator = uniqueName(data_layer);

        var data = {
          name: 'home',
          parent: '/',
        };

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({ name: [ 'Should be unique' ] });
        });

      });

      it('adds an error and is case sensitive', function () {


        var data_layer = {
          find: kwery.flat.bind(null, [
            {
              name: 'Home',
              path: '/home',
            }
          ]),
        };

        var validator = uniqueName(data_layer);

        var data = {
          name: 'home',
          parent: '/',
        };

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({ name: [ 'Should be unique' ] });
        });

      });

    });

  });

});
