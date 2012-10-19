var helpers = require('../helpers');

describe('Helpers', function () {

  describe('Pretty path', function () {
    
    it('creates pretty paths!', function () {

      helpers.prettyPath('/this/is/path').should.eql('<span>this</span> / <span>is</span> / <span>path</span>');

    });

  });

});
