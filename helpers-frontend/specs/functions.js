var functions = require('../functions');

describe('is part of url', function () {

  it('matches /products and /products/foobar-super', function () {

    var current = '/products/foobar-super';

    var nodes = [
      '/products',
      '/products/foobar',
      '/products/foobar-super',
    ];

    var result = [];

    nodes.forEach(function (node) {

      if (functions.isPartOfUrl(node, current)) {
        result.push(node);
      }

    });

    result.should.eql([
      '/products',
      '/products/foobar-super',
    ]);

  });

});
