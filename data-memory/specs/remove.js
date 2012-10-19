var eql = require('eql');
var remove = require('../remove');

describe('Remove', function () {
  
  it('removes the node', function (done) {
    var db = [ { id: 0, path: '/tags' }, { id: 1, path: '/products' } ];

    var result = remove(db, { id: 0 });

    result.success(function () {
      eql(db, [ { id: 1, path: '/products' } ]);
      done();
    });

  });

  it('removes the node and all its children', function (done) {

    var db = [
      { id: 0, path: '/'},
      { id: 1, path: '/product' },
      { id: 2, path: '/product/tag' },
      { id: 3, path: '/tags' }
    ];

    var result = remove(db, { id: 1 });

    result.success(function () {
      eql(db, [ { id: 0, path: '/' }, { id: 3, path: '/tags' } ]);
      done();
    });

  });

});
