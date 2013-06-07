var data = global.data;
var settings = global.settings;

describe('Tree', function () {

  beforeEach(settings.beforeEach);

  it('returns a tree from all the matching nodes', function (done) {
    
    var result = data.tree({ path: /.*/ });

    var util = require('util');
    result.success(function (response) {

      var expected = [
        {
          path: '/boards',
          order: 0,
          sort: [0],
          name: 'Boards',
          type: 'category',
          color: 'red',
          children: [
            {
              path: '/boards/skateboard',
              order: 0,
              sort: [0, 0],
              name: 'Skateboard',
              type: 'product',
              children: [
                {
                  name: 'Wheel',
                  order: 0,
                  sort: [0, 0, 0],
                  path: '/boards/skateboard/wheel',
                  type: 'part',
                }
              ]
            }
          ],
        },
        {
          path: '/blades',
          order: 1,
          sort: [1],
          name: 'Blades',
          type: 'category',
          color: 'blue',
        }
      ];

      response.should.eql(expected);

      done();

    });

  });

});

