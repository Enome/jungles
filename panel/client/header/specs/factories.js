var factories = require('../factories');

describe('factories', function () {

  it('returns the root navigation', function () {

    factories().pathToNavigation('/').should.eql([
      { path: '/', name: 'Root' }
    ]);

  });

  it('returns the navigation', function () {

    factories().pathToNavigation('/products/skateboard').should.eql([
      { path: '/', name: 'Root' },
      { path: '/products', name: 'products' },
      { path: '/products/skateboard', name: 'skateboard' },
    ]);

  });

});
