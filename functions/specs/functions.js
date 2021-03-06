var functions = require('../index');

describe('Functions', function () {
  
  describe('getFilename', function () {

    it('returns the uuid if no filename is present', function () {

      var filename = '89de7734-656b-42b7-be72-2f94b1f9b1b8.png';
      functions.getFilename(filename).should.eql('89de7734-656b-42b7-be72-2f94b1f9b1b8.png');

    });

    it('returns the filename if filename is present', function () {

      var filename = '89de7734-656b-42b7-be72-2f94b1f9b1b8thisisthename.png';
      functions.getFilename(filename).should.eql('thisisthename.png');

    });

    it('returns the uuid if no extension is present and no filename is present', function () {
      var filename = '89de7734-656b-42b7-be72-2f94b1f9b1b8';
      functions.getFilename(filename).should.eql('89de7734-656b-42b7-be72-2f94b1f9b1b8');
    });

    it('returns the filename if no extension is present and filename is present', function () {
      var filename = '89de7734-656b-42b7-be72-2f94b1f9b1b8thisisthename';
      functions.getFilename(filename).should.eql('thisisthename');
    });

  });

  describe('functions.getParent', function () {

    it('return the root', function () {
      functions.getParent('/skateboard').should.eql('/');
    });

    it('returns the first level', function () {
      functions.getParent('/skateboard/wheels').should.eql('/skateboard');
    });

    it('returns the second level', function () {
      functions.getParent('/skateboard/wheels/yellow').should.eql('/skateboard/wheels');
    });

  });

});
