var functions = require('../functions');

describe('Customize Functions', function () {

  var components;

  beforeEach(function () {

    components = [

      function (callback) {
        callback(null, {
          css: 'First',
          html: [
            {
              name: 'home',
              html: 'home page'
            },
            {
              name: 'contact',
              html: 'contact page'
            }
          ]
        });
      },

      function (callback) {
        callback(null, {
          javascript: 'First',
          html: [
            {
              name: 'about',
              html: 'about page'
            },
            {
              name: 'products',
              html: 'products page'
            }
          ]
        });
      },

      function (callback) {
        callback(null, {
          javascript: 'Second',
          css: 'Second'
        });
      }

    ];

  });

  describe('Javascript', function () {

    it('returns the merged javascript', function (done) {

      functions.javascript(components, function (javascript) {
        javascript.should.eql('First\nSecond\n');
        done();
      });

    });

  });

  describe('Css', function () {

    it('returns the merged css', function (done) {

      functions.css(components, function (css) {
        css.should.eql('First\nSecond\n');
        done();
      });

    });

  });

  describe('Html', function () {

    it('returns the html objects with all the pages', function (done) {

      functions.html(components, function (html) {

        html.should.eql({
          home: 'home page',
          contact: 'contact page',
          about: 'about page',
          products: 'products page'
        });

        done();

      });

    });

  });

});
