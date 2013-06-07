var data = global.data;
var settings = global.settings;

describe('Dump', function () {

  beforeEach(settings.beforeEach);

  it('returns all the instances in order', function (done) {

    data.dump(function (response) {

      response.should.eql([
        {
          type: 'category',
          path: '/boards',
          name: 'Boards',
          sort: [0],
          order: 0,
          color: 'red',
        },
        {
          name: 'Skateboard',
          type: 'product',
          path: '/boards/skateboard',
          order: 0,
          sort: [0, 0],
        },
        {
          type: 'part',
          path: '/boards/skateboard/wheel',
          name: 'Wheel',
          sort: [0, 0, 0],
          order: 0
        },
        {
          type: 'category',
          path: '/blades',
          name: 'Blades',
          sort: [1],
          order: 1,
          color: 'blue',
        }
      ]);

      done();

    });

  });

});
