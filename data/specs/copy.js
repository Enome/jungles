var data = global.data;
var settings = global.settings;

describe('Copy >', function () {

  beforeEach(settings.beforeEach);

  describe('Without children >', function () {

    it('copies the instance to root', function (done) {

      var result = data.copy({ path: '/boards/skateboard/wheel', parent: '/' });

      result.success(function (response) {

        response.should.eql([{
          name: 'Wheel',
          path: '/wheel',
          order: 0,
          sort: [0],
          type: 'part',
        }]);

        done();

      });

    });

    it('copies the instance to a parent', function (done) {

      var result = data.copy({ path: '/boards/skateboard/wheel', parent: '/blades' });

      result.success(function (response) {

        response.should.eql([{
          name: 'Wheel',
          path: '/blades/wheel',
          order: 0,
          sort: [1, 0],
          type: 'part',
        }]);

        done();

      });

    });

  });

  describe('With children >', function () {

    it('copies the instances to root', function (done) {

      var result = data.copy({ path: '/boards/skateboard', parent: '/' });

      result.success(function (response) {

        response.should.eql([
          {
            name: 'Skateboard',
            path: '/skateboard',
            order: 0,
            sort: [0],
            type: 'product',
          },
          {
            name: 'Wheel',
            path: '/skateboard/wheel',
            order: 0,
            sort: [0, 0],
            type: 'part',
          },
        ]);

        done();

      });

    });

    it('copies the instances to a parent', function (done) {

      var result = data.copy({ path: '/boards/skateboard', parent: '/blades' });

      result.success(function (response) {

        response.should.eql([
          {
            name: 'Skateboard',
            path: '/blades/skateboard',
            order: 0,
            sort: [1, 0],
            type: 'product',
          },
          {
            name: 'Wheel',
            path: '/blades/skateboard/wheel',
            order: 0,
            sort: [1, 0, 0],
            type: 'part',
          },
        ]);

        done();

      });

    });

  });

});
