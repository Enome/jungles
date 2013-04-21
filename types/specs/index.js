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
      path: '/',
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

    describe('when the order isnt defined', function () {

      it('sets the order to zero if its the first one', function (done) {

        delete product.order;

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

        t.error(console.log);

      });


      it('get the previous highest order and adds 1', function (done) {

        delete product.order;

        data_item.name = 'skateboard';
        data_item.order = 21;

        var t = types(settings, data([data_item])).create(product);

        t.success(function (one) {

          one.should.eql({
            name: 'snowboard',
            type: 'product',
            price: 15,
            order: 22,
            path: '/snowboard',
          });

          done();

        });

        t.error(console.log);

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
