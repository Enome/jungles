var find = require('../find');
var eql = require('eql');

describe('Find', function () {
  
  describe('by name', function () {

    it('returns the snowboard', function (done) {
      
      var db = [ { name: 'snowboard' } ];
      var result = find(db, { name: 'snowboard' });

      result.one(function (response) {

        response.should.eql({ name: 'snowboard' });

        done();
      
      });

    });

  });


  describe('by path', function () {

    it('returns the snowboard', function (done) {
      
      var db = [ { name: 'snowboard', path: '/products/snowboard' } ];

      var result = find(db, { path: '/products/snowboard' });

      result.one(function (response) {

        response.should.eql({ name: 'snowboard', path: '/products/snowboard' });

        done();
      
      });

    });

  });


  describe('Many', function () {

    it('returns the 2 objects', function (done) {
      
      var db = [ { name: 'snowboard', sort: [0] }, { name: 'snowskate', sort: [1] } ];

      var result = find(db, { name: /snow\w+/ });

      result.many(function (response) {

        eql(response, db);

        done();
      
      });

    });

    it('returns an empty array', function (done) {
      
      var db = [ { name: 'snowboard' }, { name: 'snowskate' } ];

      var result = find(db, { name: 'skateboard' });

      result.many(function (response) {

        eql(response, []);

        done();
      
      });

    });
  
  });


  describe('One', function () {

    it('returns one object', function (done) {
      
      var db = [ { name: 'snowboard' }, { name: 'snowskate' } ];

      var result = find(db, { name: 'snowboard' });

      result.one(function (response) {

        eql(response, { name: 'snowboard' });

        done();
      
      });

    });
  
  });


  describe('Empty', function () {
  
    it('calls empty', function (done) {
      
      var db = [ { name: 'snowboard' }, { name: 'snowskate' } ];

      var result = find(db, { name: 'skateboard' });

      result.empty(function () {

        done();
      
      });

    });
  
  });


});
