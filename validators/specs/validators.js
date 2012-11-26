var validators = require('../src/validators');
var required = validators.required;
var string = validators.string;
var integer = validators.integer;
var array = validators.array;
var url = validators.url;

describe('Validators', function () {

  var data, errors, sanitize;

  beforeEach(function () {

    errors = {};
    sanitize = {};

  });

  describe('Valid', function () {

    beforeEach(function () {
      data = {
        name: 'Geert',
        age: 18,
        files: [ 'me.jpg', 'soon.png' ],
        link: 'http://www.google.be'
      };
    });

    describe('Required', function () {

      it('adds no error when string isnt empty', function (done) {

        var validator = required();

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Integer', function () {

      it('adds no error when the value is an integer and sanitizes the int', function (done) {

        var validator = integer();

        validator(data, 'age', errors, sanitize, function () {
          sanitize.should.eql({ age: 18 });
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Array', function () {

      it('adds no error when the value is an array and sanitizes the array', function (done) {

        var validator = array();

        validator(data, 'files', errors, sanitize, function () {
          sanitize.should.eql({ files: [ 'me.jpg', 'soon.png' ] });
          errors.should.eql({});
          done();
        });

      });

      it('adds no error when the value is undefined', function (done) {

        var validator = array();

        validator(data, 'names', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Url', function () {

      it('adds no error when the value is an url', function (done) {

        var validator = url();

        validator(data, 'link', errors, sanitize, function () {
          errors.should.eql({});
          done();
        });

      });

      it('adds no error when the value is undefined', function (done) {

        var validator = url();

        validator({ link: undefined }, 'link', errors, sanitize, function () {
          errors.should.eql({});
          done();
        });

      });

    });


  });

  describe('Invalid', function () {

    beforeEach(function () {

      data = { name: ' ', age: 'abc', files: 15, link: 'xzf://www.google.be' };

    });

    describe('Required', function () {

      it('adds an error when the string none whitespace empty', function (done) {

        var validator = required();

        validator(data, 'name', errors, sanitize, function () {
          errors.should.eql({name: ['String is empty']});
          done();
        });

      });

    });

    describe('Integer', function () {

      it('adds an error when the value isnt an integer', function (done) {

        var validator = integer();

        validator(data, 'age', errors, sanitize, function () {
          errors.should.eql({age: ['Invalid integer']});
          done();
        });

      });

    });

    describe('Array', function () {

      it('adds an error when the value isnt an array', function (done) {

        var validator = array();

        validator(data, 'files', errors, sanitize, function () {
          errors.should.eql({files: ['Not an array']});
          done();
        });

      });

    });

    describe('Url', function () {

      it('adds an error when the value isnt a url', function (done) {

        var validator = url();

        validator(data, 'link', errors, sanitize, function () {
          errors.should.eql({link: ['Invalid URL']});
          done();
        });

      });

    });


  });

  describe('Sanitizers', function () {

    beforeEach(function () {
      data = { name: 'Geert' };
    });

    describe('String', function () {

      it('returns the sanitized values', function (done) {

        var sanitizer = string();

        sanitizer(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({ name: 'Geert' });
          done();
        });

      });

      it('can take an undefined value', function (done) {

        var sanitizer = string();

        sanitizer(data, 'last_name', errors, sanitize, function () {
          sanitize.should.eql({});
          done();
        });

      });

    });

  });

});

