var eql = require('eql');
var tree = require('../tree');
var util = require('util');

describe('Tree', function () {

  it('returns a tree from all the matching nodes', function (done) {
    
    var db = [
      { path: '/snowboard', name: 'snowboard', id: 0, sort: '0' },
      { path: '/snowboard/tags', name: 'tags', id: 1, sort: '1' },
      { path: '/snowboard/tags/red', name: 'red', id: 2, sort: '2' },
      { path: '/snowboard/tags/green', name: 'green', id: 3, sort: '3' }
    ];

    var result = tree(db, { path: /.*/ });

    result.success(function (response) {

      var expected = [
        {
          id: 0,
          name: 'snowboard',
          path: '/snowboard',
          sort: '0',
          children: [
            {
              id: 1,
              name: 'tags',
              path: '/snowboard/tags',
              sort: '1',

              children: [
                { id: 2, name: 'red', path: '/snowboard/tags/red', sort: '2' },
                { id: 3, name: 'green', path: '/snowboard/tags/green', sort: '3' }
              ]

            }
          ]
        }
      ];

      eql(response, expected);

      done();

    });

  });

});
