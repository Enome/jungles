var validators = require('../src/validators');
var required = validators.required;
var string = validators.string;
var integer = validators.integer;
var array = validators.array;
var url = validators.url;
var decimal = validators.decimal;
var email = validators.email;
var compare = validators.compare;
var generic = validators.generic;
var boolean = validators.boolean;

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
        link: 'http://www.google.be',
        price: '1.05',
        email: 'info@gmail.com',
        password: '1234',
        password_verify: '1234',
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

      it('adds no error when the value is null', function (done) {

        var validator = integer();

        validator({ age: null }, 'age', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Decimal', function () {

      it('adds no error when the value is a decimal', function (done) {

        var validator = decimal();

        validator(data, 'price', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

      it('adds no error when the value is undefined', function (done) {

        var validator = decimal();

        validator({}, 'price', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Email', function () {

      it('adds no error when the value is an email', function (done) {

        var validator = email();

        validator(data, 'email', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

      it('adds no error when the value is undefined', function (done) {

        var validator = email();

        validator({}, 'email', errors, sanitize, function () {
          sanitize.should.eql({});
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

    describe('Compare', function () {

      it('adds no error when the value doesnt match', function (done) {

        var validator = compare('password');

        validator(data, 'password_verify', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

    describe('Generic', function () {

      it('adds no error when the callback returns true', function (done) {

        var validate = function (data, key, callback) {
          if (data[key] === 'Geert') {
            callback(null, 'Geert Pasteels');
          }
        };

        var validator = generic(validate);

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({ name: 'Geert Pasteels' });
          errors.should.eql({});
          done();
        });

      });

      it('doesnt sanitize anything', function (done) {

        var validate = function (data, key, callback) {
          if (data[key] === 'Geert') {
            callback();
          }
        };

        var validator = generic(validate);

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({});
          done();
        });

      });

    });

  });

  describe('Invalid', function () {

    beforeEach(function () {

      data = {
        name: ' ',
        age: 'abc',
        files: 15,
        link: 'xzf://www.google.be',
        price: '1.abc',
        email: 'infogmail.com',
        password: '1234',
        password_verify: '4321',
      };

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

    describe('Decimal', function () {

      it('adds an error when the value isnt an decimal', function (done) {

        var validator = decimal();

        validator(data, 'price', errors, sanitize, function () {
          errors.should.eql({price: ['Invalid decimal']});
          done();
        });

      });

    });

    describe('Email', function () {

      it('adds an error when the value isnt an email', function (done) {

        var validator = email();

        validator(data, 'email', errors, sanitize, function () {
          errors.should.eql({email: ['Invalid email']});
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

    describe('Compare', function () {

      it('adds no error when the value doesnt match', function (done) {

        var validator = compare('password');

        validator(data, 'password_verify', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({ password_verify: ['Didn\'t equal password']});
          done();
        });

      });

    });

    describe('Generic', function () {

      it('adds no error when the callback returns true', function (done) {

        var validate = function (data, key, callback) {
          if (data[key] === 'Geert') {
            return callback(null, 'Geert Pasteels');
          }

          callback('Not your name');
        };

        var validator = generic(validate);

        validator(data, 'name', errors, sanitize, function () {
          sanitize.should.eql({});
          errors.should.eql({ name: [ 'Not your name' ] });
          done();
        });

      });

    });

  });

  describe('Sanitizers', function () {

    beforeEach(function () {
      data = {
        name: 'Geert',
        payed: true,
      };
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

    describe('Boolean', function () {

      it('returns the sanitized values', function (done) {

        var sanitizer = boolean();

        sanitizer(data, 'payed', errors, sanitize, function () {
          sanitize.should.eql({ payed: true });
          done();
        });

      });

      it('can take an undefined value', function (done) {

        var sanitizer = boolean();

        sanitizer(data, 'last_name', errors, sanitize, function () {
          sanitize.should.eql({});
          done();
        });

      });

    });

  });

});
