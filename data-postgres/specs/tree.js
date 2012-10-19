var eql = require('eql');
var tree = require('../tree');
var setup = require('../setup');
var db = require('./db');

describe('Tree', function () {

  before(function (done) {

    db.query('DROP TABLE IF EXISTS instances; DROP TABLE IF EXISTS settings;', function (err, result) {

      setup(db, function () {

        var query = "INSERT INTO instances(type, path, name, sort)" +
                    "VALUES" +
                    "('product', '/snowboard', 'snowboard', '{ 0 }'), " +
                    "('tags', '/snowboard/tags', 'tags', '{ 0, 0 }'), " +
                    "('tag', '/snowboard/tags/red', 'red', '{ 0, 0, 0 }'), " +
                    "('tag', '/snowboard/tags/green', 'green', '{ 0, 0, 1 }') " +
                    "RETURNING *;";
        
        db.query(query, function (err, result) {
          done(err);
        });

      });

    });

  });

  it('returns a tree from all the matching nodes', function (done) {
    
    var result = tree(db, { path: /.*/ });

    result.success(function (response) {

      var expected = [
        {
          id: 1,
          name: 'snowboard',
          path: '/snowboard',
          type: 'product',
          sort: [0],
          arrange: 0,
          data: null,
          children: [
            {
              id: 2,
              name: 'tags',
              path: '/snowboard/tags',
              type: 'tags',
              sort: [0, 0],
              arrange: 0,
              data: null,

              children: [
                {
                  id: 3,
                  name: 'red',
                  path: '/snowboard/tags/red',
                  type: 'tag',
                  sort: [ 0, 0, 0 ],
                  arrange: 0,
                  data: null,
                },
                {
                  id: 4,
                  name: 'green',
                  path: '/snowboard/tags/green',
                  type: 'tag',
                  sort: [ 0, 0, 1 ],
                  arrange: 1,
                  data: null,
                }
              ]

            }
          ]
        }
      ];

      response.should.eql(expected);
      done();

    });

  });

});
