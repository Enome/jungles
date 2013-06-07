var data = global.data;
var settings = global.settings;

describe('Create >', function () {

  beforeEach(settings.beforeEach);

  it('creates a root object when no parent is given', function (done) {

    var result = data.create({ type: 'category', name: 'Roller Blades', order: 0 });

    result.success(function (instance) {

      instance.should.eql([{
        type: 'category',
        name: 'Roller Blades',
        path: '/roller-blades',
        order: 0,
        sort: [0],
      }]);

      done();

    });

  });

  it('creates a second root object with extra data', function (done) {

    var result = data.create({ type: 'category', name: 'Roller Blades', body: 'This is the body', order: 1 });

    result.success(function (instance) {
      instance.should.eql([{
        type: 'category',
        name: 'Roller Blades',
        path: '/roller-blades',
        body: 'This is the body',
        order: 1,
        sort: [1],
      }]);
      done();
    });

  });

  it('creates a child object when parent is given', function (done) {

    var result = data.create({ parent: '/boards', type: 'product', name: 'Skateboard', order: 0 });

    result.success(function (instance) {

      instance.should.eql([{
        type: 'product',
        name: 'Skateboard',
        path: '/boards/skateboard',
        order: 0,
        sort: [0, 0],
      }]);

      done();

    });

  });


  it('creates a child object with data', function (done) {

    var result = data.create({ parent: '/boards', type: 'product', name: 'Long Board', order: 0, material: 'plastic' });

    result.success(function (instance) {

      instance.should.eql([{
        type: 'product',
        name: 'Long Board',
        material: 'plastic',
        path: '/boards/long-board',
        order: 0,
        sort: [0, 0],
      }]);

      done();

    });

  });

});
