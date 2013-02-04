var types = require('../index');
var data = require('jungles-data-memory');
var validators = require('jungles-validators');

describe('types', function () {

  var product, data_item, result, settings;

  beforeEach(function () {

    product = {
      name: 'snowboard',
      type: 'product',
      price: '15',
      order: 0,
    };

    data_item = {
      name: 'snowboard',
      type: 'product',
      price: 15,
      order: 0,
      sort: [0],
      path: '/snowboard',
    };

    settings = [{
      name: 'product',
      schema: { price: [ validators.integer() ] }
    }];

  });

  describe('create', function () {

    it('creates the product', function (done) {

      var t = types(settings, data([])).create(product);

      t.success(function (one) {

        one.should.eql({
          name: 'snowboard',
          type: 'product',
          price: 15,
          order: 0,
          path: '/snowboard',
        });

        done();

      });

    });

    it('throws a validation error', function (done) {

      product.price = 'abc';

      var t = types(settings, data([])).create(product);

      t.error(function (one) {
        one.should.eql({ price: [ 'Invalid integer' ] });
        done();
      });

    });

  });

  describe('update', function () {

    it('updates the product', function (done) {

      var new_product = {
        path: '/snowboard',
        price: 29,
      };

      var t = types(settings, data([data_item])).update(new_product);

      t.success(function (one) {

        one.should.eql({
          name: 'snowboard',
          type: 'product',
          price: 29,
          order: 0,
          path: '/snowboard',
        });

        done();

      });

    });

    it('throws a validation error', function (done) {

      var new_product = {
        path: '/snowboard',
        price: 'qbc',
      };

      var t = types(settings, data([data_item])).update(new_product);

      t.error(function (one) {
        one.should.eql({ price: [ 'Invalid integer' ] });
        done();
      });

    });

  });

});
