var data = global.data;
var settings = global.settings;

describe('Remove >', function () {

  beforeEach(settings.beforeEach);

  describe('Without children', function () {

    it('removes the instance', function (done) {

      var result = data.remove({ path: '/boards/skateboard/wheel' });

      result.success(function (response) {

        response.should.eql([{
          type: 'part',
          path: '/boards/skateboard/wheel',
          name: 'Wheel',
          sort: [ 0, 0, 0 ],
          order: 0
        }]);

        done();

      });

    });

  });

  describe('With children', function () {

    it('removes the instances', function (done) {

      var result = data.remove({ path: '/boards/skateboard' });

      result.success(function (response) {

        response.should.eql([
          {
            name: 'Skateboard',
            path: '/boards/skateboard',
            order: 0,
            sort: [0, 0],
            type: 'product',
          },
          {
            name: 'Wheel',
            path: '/boards/skateboard/wheel',
            order: 0,
            sort: [0, 0, 0],
            type: 'part',
          },
        ]);

        done();

      });

    });

  });

});
