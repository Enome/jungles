var eql = require('eql');
var save = require('../save');
var setup = require('../setup');
var db = require('./db');

describe('Save', function () {

  before(function (done) {
    db.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {
      setup(db, done);
    });
  });

  describe('Create', function () {

    it('sets path starting with root is parent is empty', function (done) {

      var result = save(db, { type: 'product', parent: 0, name: 'snowboard', arrange: 0 });

      result.success(function (response) {

        db.query('select * from instances', function (err, result) {

          result.rows.should.eql([{ type: 'product', path: '/snowboard', name: 'snowboard', id: 1, sort: [0], data: '{}' }]);

          done();
        });


      });

    });

    it('sets path starting with the parent\'s path', function (done) {

      var result = save(db, { type: 'tag', parent: 1, name: 'snow', arrange: '1' });

      result.success(function () {

        db.query('select * from instances', function (err, result) {

          result.rows.should.eql([ { type: 'product', path: '/snowboard', name: 'snowboard', id: 1, sort: [0], data: '{}' },
                                   { type: 'tag', path: '/snowboard/snow', name: 'snow', id: 2, sort: [0, 1], data: '{}' } ]);

          done();
        });

      });

    });

  });


  describe('Update', function () {

    it('updates the document if the data has an id', function (done) {
      
      var result = save(db, { id: 1, name: 'snowboarder' });

      result.success(function () {

        db.query('select * from instances', function (err, result) {

          eql(result.rows, [
            { type: 'product', path: '/snowboarder', name: 'snowboarder', id: 1, sort: [0], data: '{}' },
            { type: 'tag', path: '/snowboarder/snow', name: 'snow', id: 2, sort: [0, 1], data: '{}' },
          ]);

          done();
        });

      });

    });

  });


  describe('Data', function () {

    describe('Create', function () {

      it('serializes data', function (done) {

        var result = save(db, { type: 'product', parent: 0, name: 'surfboard', body: 'body', title: 'title', arrange: 1 });

        result.success(function (response) {

          db.query('select * from instances', function (err, result) {

            eql(result.rows, [ { type: 'product', path: '/snowboarder', name: 'snowboarder', id: 1, sort: [0], data: '{}' },
                               { type: 'tag', path: '/snowboarder/snow', name: 'snow', id: 2, sort: [0, 1], data: '{}' },
                               { type: 'product', path: '/surfboard', name: 'surfboard', id: 3, sort: [1], data: JSON.stringify({body: 'body', title: 'title'}) } ]);

            done();

          });

        });

      });

    });

    describe('Update', function () {

      it('serializes data', function (done) {

        var result = save(db, { id: 3, tags: 'one, two' });

        result.success(function (response) {

          db.query('select * from instances', function (err, result) {

            eql(result.rows, [
              { type: 'product', path: '/snowboarder', name: 'snowboarder', id: 1, sort: [0], data: '{}' },
              { type: 'tag', path: '/snowboarder/snow', name: 'snow', id: 2, sort: [0, 1], data: '{}' },
              { type: 'product', path: '/surfboard', name: 'surfboard', id: 3, sort: [1], data: JSON.stringify({body: 'body', title: 'title', tags: 'one, two' }) }
            ]);

            done();

          });

        });

      });

    });

  });

});
