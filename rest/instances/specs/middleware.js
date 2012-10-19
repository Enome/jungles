var sinon = require('sinon');
var recorder = require('express-recorder');
var middleware = require('../middleware');

describe('Instances Middleware', function () {

  describe('find', function () {

    it('sets response to instances', function (done) {
      
      var response = '__instances__';

      var result = {
        many: sinon.stub().yields(response)
      };

      var core = {
        data: {
          find: sinon.stub().returns(result)
        }
      };

      middleware.inject(core);

      var handler = middleware.find(function () {
        return { id: this.req.body.id };
      });

      var state = {
        body: {
          id: 'someid'
        }
      };

      recorder(handler, state, function (result) {
        result.eql({
          next: true,
          locals: { instances: '__instances__' }
        });

        // Extra: verify find
        
        core.data.find.args.should.eql([ [ { id: 'someid' } ] ]);

        done();
      });

    });

  });

  describe('save', function () {

    it('calls nexts and sets the saved object', function (done) {

      var response = {
        user: 'Enome'
      };

      var result = {
        success: sinon.stub().yields(response)
      };

      var core = {
        data: { save: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        locals: { data: '__data__' }
      };

      recorder(middleware.save, state, function (result) {

        result.eql({
          next: true,
          locals: { response: { user: 'Enome' }, data: '__data__' }
        });

        done();

      });

    });

  });

  describe('remove', function () {
    
    it('removes the instance', function (done) {
      
      // Setup dependencies

      var result = {
        success: sinon.stub().yields()
      };

      var core = {
        data: { remove: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      // Setup middleware

      var state = {
        params: { id: 'someid' }
      };

      // Record

      recorder(middleware.remove, state, function (result) {

        result.eql({ next: true });

        // Extra: verify remove

        core.data.remove.args.should.eql([[ { id: 'someid' } ]]);
        done();

      });

    });

  });

  describe('addChildTypes', function () {

    it('adds the child types to instances', function (done) {
      
      // Setup dependencies

      var type = { children: '__some_types__' };

      var result = {
        one: sinon.stub().yields(type)
      };

      var core = {
        types: { find: sinon.stub().returns(result) }
      };

      middleware.inject(core);

     
      // Setup Middleware

      var state = {
        locals: { instances: [ { type: 'book' }, { type: 'page' } ] }
      };

      
      // Record

      recorder(middleware.addChildTypes, state, function (result) {

        result.eql({
          next: true,
          locals: {
            instances: [
              { type: 'book', children: '__some_types__' },
              { type: 'page', children: '__some_types__' },
            ]
          }
        });

        // Extra: verify types.find
        
        core.types.find.args.should.eql([ [ { name: 'book' } ], [ { name: 'page' } ] ]);

        done();

      });

    });

  });

});
