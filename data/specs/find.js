var data = global.data;
var settings = global.settings;

describe('Find >', function () {

  beforeEach(settings.beforeEach);

  describe('One >', function () {

    it('finds the instance by name using a string', function (done) {
      
      var result = data.find({ name: 'Skateboard' });

      result.one(function (response) {

        response.should.eql({
          name: 'Skateboard',
          type: 'product',
          path: '/boards/skateboard',
          order: 0,
          sort: [0, 0],
        });

        done();
      
      });

    });

    it('finds the skateboard by path using regex', function (done) {
      
      var result = data.find({ path: /\/boards\/skateboard/ });

      result.one(function (response) {

        response.should.eql({
          name: 'Skateboard',
          type: 'product',
          path: '/boards/skateboard',
          order: 0,
          sort: [0, 0],
        });

        done();
      
      });

    });

  });

  describe('Many >', function () {

    it('returns boards and it\'s children', function (done) {
      
      var result = data.find({ path: /\/boards.*/ });

      result.many(function (response) {

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
          }
        ]);

        done();
      
      });

    });

  });

  describe('Empty >', function () {

    it('returns an empty array', function (done) {
      
      var result = data.find({ name: 'snowboard' });

      result.many(function (response) {
        response.should.eql([]);
        done();
      });

    });

  });

});
