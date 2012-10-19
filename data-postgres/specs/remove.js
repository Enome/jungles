var eql = require('eql');
var remove = require('../remove');
var setup = require('../setup');
var db = require('./db');

describe('Remove', function () {

  before(function (done) {

    db.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {

      setup(db, function () {

        var query = "INSERT INTO instances(type, path, name, sort)" +
                    "VALUES" +
                    "('product', '/snowboard', 'snowboard', '{0}'),  " +
                    "('product', '/skateboard', 'skateboard', '{1}'), " +
                    "('tag', '/skateboard/wheel', 'wheel', '{0, 0}'), " +
                    "('product', '/longboard', 'longboard', '{2}'),  " +
                    "('product', '/surfboard', 'surfboard', '{3}')  " +
                    "RETURNING *;";
        
        db.query(query, function (err, result) {
          done(err);
        });

      });

    });

  });
  
  it('removes the surfboard', function (done) {
    var result = remove(db, { name: 'surfboard' });

    result.success(function () {

      db.query('select name from instances', function (err, result) {
        result.rows.should.eql([
          { name: 'snowboard' },
          { name: 'skateboard' },
          { name: 'wheel' },
          { name: 'longboard' }
        ]);
      });

      done();
    });

  });

  it('removes the skateboard and all its children', function (done) {

    var result = remove(db, { name: 'skateboard' });

    result.success(function () {

      db.query('select name from instances', function (err, result) {
        result.rows.should.eql([
          { name: 'snowboard' },
          { name: 'longboard' }
        ]);
      });

      done();
    });

  });

});
