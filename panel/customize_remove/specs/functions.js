var functions = require('../functions');

describe('Customize Functions', function () {

  var components;

  beforeEach(function () {

    components = [

      {
        name: 'foo',
        js: __dirname + '/files/1.txt',
        css: __dirname + '/files/2.txt',
        assets: __dirname + '/files',
      },

      {
        name: 'bar',
        js: __dirname + '/files/2.txt',
        css: __dirname + '/files/1.txt',
        assets: __dirname + '/files',
      },

    ];

  });

  describe('Javascript', function () {

    it('returns the merged javascript', function (done) {

      functions.javascript(components, function (string) {
        string.should.eql('one.txt\ntwo.txt\n');
        done();
      });

    });

  });

  describe('Css', function () {

    it('returns the merged css', function (done) {

      functions.css(components, function (string) {
        string.should.eql('two.txt\none.txt\n');
        done();
      });

    });

  });

  describe('assets', function () {

    it('returns the asset path by component name and file name', function () {

      functions.assets(components, 'foo', '1.txt').should.eql(__dirname + '/files/1.txt');
      functions.assets(components, 'bar', '2.txt').should.eql(__dirname + '/files/2.txt');

    });

  });

});
