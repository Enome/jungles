require('should');
var eql = require('eql');
var data = global.data;

describe('Create >', function () {

  it('creates a root object when no parent is given', function (done) {

    var result = data.create({ type: 'products', name: 'products', order: 0 });

    result.success(function (instance) {
      eql(instance, {
        type: 'products',
        name: 'products',
        path: '/products',
        order: 0,
      });
      done();
    });

  });

  it('creates a second root object with extra data', function (done) {

    var result = data.create({ type: 'page', name: 'home', body: 'This is the body', order: 1 });

    result.success(function (instance) {
      eql(instance, {
        type: 'page',
        name: 'home',
        path: '/home',
        body: 'This is the body',
        order: 1,
      });
      done();
    });

  });

  it('creates a child object on the parent', function (done) {

    var result = data.create({ parent: '/products', type: 'product', name: 'snowboard', order: 0 });

    result.success(function (instance) {

      eql(instance, {
        type: 'product',
        name: 'snowboard',
        path: '/products/snowboard',
        order: 0
      });

      done();

    });

  });

  it('creates a child object on a child object with data', function (done) {

    var result = data.create({ parent: '/products/snowboard', type: 'wheel', name: 'yellow', order: 0, material: 'plastic' });

    result.success(function (instance) {

      eql(instance, {
        type: 'wheel',
        name: 'yellow',
        material: 'plastic',
        path: '/products/snowboard/yellow',
        order: 0
      });

      done();

    });

  });

});

describe('Update >', function () {

  it('updates the instance changing the name and path when name is given', function (done) {
    
    var result = data.update({ path: '/products/snowboard', name: 'skateboard' });

    result.success(function (instance) {

      eql(instance, {
        type: 'product',
        name: 'skateboard',
        path: '/products/skateboard',
        order: 0
      });

      done();
      
    });

  });

  it('updates the instance changing sort when order is given', function (done) {
    
    var result = data.update({ path: '/products/skateboard', order: 1 });

    result.success(function (instance) {

      eql(instance, {
        type: 'product',
        name: 'skateboard',
        path: '/products/skateboard',
        order: 1
      });

      done();
      
    });

  });

  it('rewrites the children\'s path and sort when parent updates', function (done) {

    var result = data.update({ path: '/products', order: 2, name: 'items' });

    result.success(function (instance) {

      var find = data.find({ path: new RegExp('.*') });

      find.many(function (instances) {

        eql(instances, [
          {
            type: 'page',
            name: 'home',
            path: '/home',
            body: 'This is the body',
            order: 1,
          },
          {
            type: 'products',
            name: 'items',
            path: '/items',
            order: 2
          },
          {
            type: 'product',
            name: 'skateboard',
            path: '/items/skateboard',
            order: 1,
          },
          {
            type: 'wheel',
            name: 'yellow',
            path: '/items/skateboard/yellow',
            material: 'plastic',
            order: 0,
          }
        ]);

        done();

      });

      
    });

  });

});

describe('Find >', function () {

  describe('One >', function () {

    it('finds the skateboard by name using a string', function (done) {
      
      var result = data.find({ name: 'skateboard' });

      result.one(function (response) {

        eql(response, {
          name: 'skateboard',
          type: 'product',
          path: '/items/skateboard',
          order: 1,
        });

        done();
      
      });

    });


    it('finds the skateboard by path using regex', function (done) {
      
      var result = data.find({ path: /\/items\/skateboard/ });

      result.one(function (response) {

        eql(response, {
          name: 'skateboard',
          type: 'product',
          path: '/items/skateboard',
          order: 1
        });

        done();
      
      });

    });

  });

  describe('Many >', function () {

    it('returns items and skateboard', function (done) {
      
      var result = data.find({ path: /\/items.*/ });

      result.many(function (response) {

        eql(response, [
          {
            type: 'products',
            name: 'items',
            path: '/items',
            order: 2
          },
          {
            name: 'skateboard',
            type: 'product',
            path: '/items/skateboard',
            order: 1,
          },
          {
            type: 'wheel',
            name: 'yellow',
            material: 'plastic',
            path: '/items/skateboard/yellow',
            order: 0
          }
        ]);

        done();
      
      });

    });

    describe('Empty >', function () {

      it('returns an empty array', function (done) {
        
        var result = data.find({ name: 'snowboard' });

        result.many(function (response) {
          eql(response, []);
          done();
        });

      });
    
    });

  });

  describe('Empty >', function () {
  
    it('calls empty', function (done) {
      
      var result = data.find({ name: 'snowboard' });

      result.empty(function () {

        done();
      
      });

    });
  
  });

});

describe('Remove >', function () {

  it('removes one instance', function (done) {

    var result = data.remove({ name: 'home' });

    result.success(function () {

      var find = data.find({ path: /.*/ });

      find.many(function (instances) {

        eql(instances, [
          {
            type: 'products',
            name: 'items',
            path: '/items',
            order: 2
          },
          {
            type: 'product',
            name: 'skateboard',
            path: '/items/skateboard',
            order: 1,
          },
          {
            type: 'wheel',
            name: 'yellow',
            material: 'plastic',
            path: '/items/skateboard/yellow',
            order: 0
          }
        ]);

        done();

      });

    });

  });

  it('removes one instance and also its children', function (done) {

    var result = data.remove({ name: 'items' });

    result.success(function () {

      var find = data.find({ path: '.*' });

      find.many(function (instances) {
        instances.should.eql([]);
        done();
      });

    });

  });

});
