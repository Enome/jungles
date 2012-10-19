var find = require('../find');
var eql = require('eql');
var setup = require('../setup');
var db = require('./db');

var snowboard = { id: 1, type: 'product', path: '/snowboard', name: 'snowboard', sort: [0], arrange: 0, body: 'The Body', title: 'Title' };
var skateboard = { id: 2, type: 'product', path: '/skateboard', name: 'skateboard', sort: [1], arrange: 1, data: '' };
var wheel = { id: 3, type: 'tag', path: '/skateboard/wheel', name: 'wheel', sort: [0, 0], arrange: 0, data: '' };

describe('Find', function () {

  before(function (done) {

    db.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {

      setup(db, function () {

        var json = JSON.stringify({body: 'The Body', title: 'Title'});

        var query = "INSERT INTO instances(type, path, name, sort, data)" +
                    "VALUES" +
                    "('product', '/snowboard', 'snowboard', '{ 0 }', '" + json + "'), " +
                    "('product', '/skateboard', 'skateboard', '{ 1 }', ''), " +
                    "('tag', '/skateboard/wheel', 'wheel', '{ 0, 0 }', '');";
        
        db.query(query, function (err, result) {
          done(err);
        });

      });

    });

  });

  describe('many', function () {

    it('returns all the products', function (done) {
      
      var result = find(db, { type: 'product' });

      result.many(function (response) {
        eql(response, [ snowboard, skateboard ]);
        done();
      });

      result.error(done);

    });

    // Two normal conditionals

    it('returns the snowboard', function (done) {

      var result = find(db, { type: 'product', name: 'snowboard' });

      result.many(function (response) {
        response.should.eql([ snowboard ]);
        done();
      });

      result.error(done);

    });

    // Regex

    it('returns everything in the skateboard path', function (done) {

      var result = find(db, { path: /\/skateboard.*/ });

      result.many(function (response) {
        eql(response, [wheel, skateboard]);
        done();
      });

      result.error(done);

    });

    // Regex + normal

    it('returns everything in the skateboard path with the name skateboard', function (done) {

      var result = find(db, { name: 'skateboard', path: /\/skateboard.*/ });

      result.many(function (response) {
        response.should.eql([ skateboard ]);
        done();
      });

      result.error(done);

    });

  });


  describe('one', function () {

    it('returns the snowboard', function (done) {
      
      var result = find(db, { id: 1 });

      result.one(function (response) {
        response.should.eql( snowboard );
        done();
      });

      result.error(done);

    });

  });


  describe('empty', function () {

    it('returns NOTHING', function (done) {

      var result = find(db, { id: 0 });

      result.empty(function () {
        true.should.be.true;
        done();
      });

      result.error(done);

    });

  });


  describe('error', function () {

    it('throws an error', function (done) {

      var result = find(db, { heyo: 0 });

      result.error(function (error) {
        error.name.should.eql('error');
        done();
      });

    });

  });

});
