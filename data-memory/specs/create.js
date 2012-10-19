var eql = require('eql');
var create = require('../create');

describe('Create', function () {

  describe('without parent', function () {

    it('set root path', function (done) {

      var db = [ { type: 'tags', path: '/path' } ];
      var result = create(db, { type: 'product', name: 'snowboard', order: 0 });

      result.success(function (response) {

        eql(response, { type: 'product', path: '/snowboard', name: 'snowboard', sort: [0] });
        done();

      });

    });

  });

  it('set root path', function (done) {

    var db = [
      { type: 'tags', path: '/path' },
      { type: 'products', path: '/products', name: 'products', sort: [0] }
    ];

    var result = create(db, { type: 'product', name: 'snowboard', order: 1, parent: '/products' });

    result.success(function (response) {

      var result = create(db, { type: 'product', name: 'skateboard', order: 2, parent: '/products' });

      result.success(function (response) {

        eql(db, [
          { type: 'tags', path: '/path' },
          { type: 'products', path: '/products', name: 'products', sort: [0] },
          { type: 'product', name: 'snowboard', path: '/products/snowboard', sort: [0, 1] },
          { type: 'product', name: 'skateboard', path: '/products/skateboard', sort: [0, 2] }
        ]);
        done();

      });

    });

  });

});
