var factories = require('../factories');

describe('factories', function () {

  it('return the root', function () {
    factories().path.parent('/skateboard').should.eql('/');
  });

  it('returns the first level', function () {
    factories().path.parent('/skateboard/wheels').should.eql('/skateboard');
  });

  it('returns the second level', function () {
    factories().path.parent('/skateboard/wheels/yellow').should.eql('/skateboard/wheels');
  });

});
