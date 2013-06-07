var data = global.data;
var settings = global.settings;

describe('Update >', function () {

  beforeEach(settings.beforeEach);

  describe('Parent AKA Move >', function () {

    describe('Without Children >', function () {

      it('changes the path and sort when parent is given', function (done) {

        var result = data.update({ path: '/boards/skateboard/wheel', parent: '/blades' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'part',
              path: '/blades/wheel',
              name: 'Wheel',
              sort: [1, 0],
              order: 0
            }
          ]);

          done();

        });

      });

    });

    describe('With Children >', function () {

      it('changes the path and sort when parent is given', function (done) {

        var result = data.update({ path: '/boards/skateboard', parent: '/' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'product',
              path: '/skateboard',
              name: 'Skateboard',
              sort: [0],
              order: 0
            },
            {
              type: 'part',
              path: '/skateboard/wheel',
              name: 'Wheel',
              sort: [0, 0],
              order: 0
            },
          ]);

          done();

        });

      });

    });

    describe('Root', function () {

      describe('Without Children >', function () {

        it('changes the path and sort when parent is given', function (done) {

          var result = data.update({ path: '/boards/skateboard/wheel', parent: '/' });

          result.success(function (response) {

            response.should.eql([
              {
                type: 'part',
                path: '/wheel',
                name: 'Wheel',
                sort: [0],
                order: 0
              }
            ]);

            done();

          });

        });

      });

      describe('With Children >', function () {

        it('changes the path and sort when parent is given', function (done) {

          var result = data.update({ path: '/boards', parent: '/blades' });

          result.success(function (response) {

            response.should.eql([
              {
                type: 'category',
                path: '/blades/boards',
                name: 'Boards',
                sort: [1, 0],
                color: 'red',
                order: 0,
              },
              {
                type: 'product',
                path: '/blades/boards/skateboard',
                name: 'Skateboard',
                sort: [1, 0, 0],
                order: 0
              },
              {
                type: 'part',
                path: '/blades/boards/skateboard/wheel',
                name: 'Wheel',
                sort: [1, 0, 0, 0],
                order: 0
              },
            ]);

            done();

          });

        });

      });

    });

  });

  describe('Name >', function () {

    describe('Without Children >', function () {

      it('changes the name and path when name is given', function (done) {

        var result = data.update({ path: '/boards/skateboard/wheel', name: 'Trunk and Wheels' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'part',
              path: '/boards/skateboard/trunk-and-wheels',
              name: 'Trunk and Wheels',
              sort: [0, 0, 0],
              order: 0
            }
          ]);

          done();

        });

      });


    });

    describe('With Children >', function () {

      it('changes the name and path when name is given', function (done) {

        var result = data.update({ path: '/boards', name: 'Extreme Boards' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'category',
              path: '/extreme-boards',
              name: 'Extreme Boards',
              sort: [0],
              color: 'red',
              order: 0
            },
            {
              type: 'product',
              path: '/extreme-boards/skateboard',
              name: 'Skateboard',
              sort: [0, 0],
              order: 0
            },
            {
              type: 'part',
              path: '/extreme-boards/skateboard/wheel',
              name: 'Wheel',
              sort: [0, 0, 0],
              order: 0
            }
          ]);

          done();

        });

      });

    });

  });

  describe('Order >', function () {

    describe('Without Children >', function () {

      it('changes the order when order is given', function (done) {

        var result = data.update({ path: '/boards/skateboard/wheel', order: 1 });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'part',
              path: '/boards/skateboard/wheel',
              name: 'Wheel',
              sort: [0, 0, 1],
              order: 1
            }
          ]);

          done();

        });

      });


    });

    describe('With Children >', function () {

      it('changes the order when path is given', function (done) {

        var result = data.update({ path: '/boards', order: 2 });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'category',
              path: '/boards',
              name: 'Boards',
              sort: [2],
              color: 'red',
              order: 2
            },
            {
              type: 'product',
              path: '/boards/skateboard',
              name: 'Skateboard',
              sort: [2, 0],
              order: 0
            },
            {
              type: 'part',
              path: '/boards/skateboard/wheel',
              name: 'Wheel',
              sort: [2, 0, 0],
              order: 0
            }
          ]);

          done();

        });

      });

    });

  });

  describe('Type >', function () {

    describe('Without Children >', function () {

      it('changes the type when type is given', function (done) {

        var result = data.update({ path: '/boards/skateboard/wheel', type: 'gear' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'gear',
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

    describe('With Children >', function () {

      it('changes the type when path is given', function (done) {

        var result = data.update({ path: '/boards', type: 'gear' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'gear',
              path: '/boards',
              name: 'Boards',
              sort: [0],
              color: 'red',
              order: 0
            },
            {
              type: 'product',
              path: '/boards/skateboard',
              name: 'Skateboard',
              sort: [0, 0],
              order: 0
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

  });

  describe('Data >', function () {

    describe('Without Children >', function () {

      it('changes the data when data is given', function (done) {

        var result = data.update({ path: '/boards/skateboard/wheel', weight: '200kg' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'part',
              path: '/boards/skateboard/wheel',
              name: 'Wheel',
              weight: '200kg',
              sort: [0, 0, 0],
              order: 0
            }
          ]);

          done();

        });

      });


    });

    describe('With Children >', function () {

      it('changes the type when path is given', function (done) {

        var result = data.update({ path: '/boards', color: 'green', height: '500m' });

        result.success(function (response) {

          response.should.eql([
            {
              type: 'category',
              path: '/boards',
              name: 'Boards',
              sort: [0],
              color: 'green',
              height: '500m',
              order: 0
            },
            {
              type: 'product',
              path: '/boards/skateboard',
              name: 'Skateboard',
              sort: [0, 0],
              order: 0
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

  });

});
