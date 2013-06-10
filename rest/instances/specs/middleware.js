var sinon = require('sinon');
var recorder = require('express-recorder');
var middleware = require('../middleware');

describe('Instances Middleware', function () {

  describe('defaultQuery', function () {

    it('sets req.query to default if it has no properties', function (done) {

      var req = { query: {} };

      middleware.defaultQuery(req, {}, function () {
        req.should.eql({ query: { path: /.*/ } });
        done();
      });
      
    });

  });

  describe('queryToRegex', function () {
    
    it('converts the properties of the query object to regexes', function (done) {

      var req = {
        query: {
          path: 'regex-/.*/',
          name: 'test',
          id: 15
        }
      };

      middleware.queryToRegex(req, {}, function () {
        req.should.eql({ query: { path: /.*/, name: 'test', id: 15 } });
        done();
      });

    });

  });

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

  describe('create', function () {

    it('calls nexts and sets the created object', function (done) {

      var response = {
        user: 'Enome'
      };

      var result = {
        success: sinon.stub().yields(response),
        error: sinon.stub(),
      };

      var core = {
        types: { create: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.create, state, function (result) {

        result.eql({
          next: true,
          locals: { response: { user: 'Enome' } }
        });
        
        //Extra
        core.types.create.args.should.eql([['__data__']]);

        done();

      });

    });

    it('calls json with errors', function (done) {

      var response = {
        name: '__error__'
      };

      var result = {
        success: sinon.stub(),
        error: sinon.stub().yields(response),
      };

      var core = {
        types: { create: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.create, state, function (result) {

        result.eql({
          json: { errors: { name: '__error__' } }
        });
        
        //Extra
        core.types.create.args.should.eql([['__data__']]);

        done();

      });

    });

  });

  describe('copy', function () {

    it('calls nexts and sets the copied object', function (done) {

      var response = {
        user: 'Enome'
      };

      var result = {
        success: sinon.stub().yields(response),
        error: sinon.stub(),
      };

      var core = {
        types: { copy: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.copy, state, function (result) {

        result.eql({
          next: true,
          locals: { response: { user: 'Enome' } }
        });
        
        //Extra
        core.types.copy.args.should.eql([['__data__']]);

        done();

      });

    });

    it('calls json with the errors', function (done) {

      var response = {
        name: '__error__'
      };

      var result = {
        success: sinon.stub(),
        error: sinon.stub().yields(response),
      };

      var core = {
        types: { copy: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.copy, state, function (result) {

        result.eql({
          json: { errors: { name: '__error__' } }
        });
        
        //Extra
        core.types.copy.args.should.eql([['__data__']]);

        done();

      });

    });

  });

  describe('update', function () {

    it('calls nexts and sets the updated object', function (done) {

      var response = {
        user: 'Enome'
      };

      var result = {
        success: sinon.stub().yields(response),
        error: sinon.stub(),
      };

      var core = {
        types: { update: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.update, state, function (result) {

        result.eql({
          next: true,
          locals: { response: { user: 'Enome' } }
        });

        // Extra
        core.types.update.args.should.eql([[ '__data__' ]]);

        done();

      });

    });

    it('calls json with the errors', function (done) {

      var response = {
        name: '__error__'
      };

      var result = {
        success: sinon.stub(),
        error: sinon.stub().yields(response),
      };

      var core = {
        types: { update: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      var state = {
        body: '__data__'
      };

      recorder(middleware.update, state, function (result) {

        result.eql({
          json: { errors: { name:  '__error__' } }
        });

        // Extra
        core.types.update.args.should.eql([[ '__data__' ]]);

        done();

      });

    });

  });

  describe('remove', function () {
    
    it('removes the instance', function (done) {
      
      // Setup dependencies

      var response = [ 'one', 'two' ];
      var result = {
        success: sinon.stub().yields(response)
      };

      var core = {
        data: { remove: sinon.stub().returns(result) }
      };

      middleware.inject(core);

      // Setup middleware

      var state = {
        params: { path: 'somepath' }
      };

      // Record

      recorder(middleware.remove, state, function (result) {

        result.eql({
          locals: { response: response },
          next: true
        });

        // Extra: verify remove

        core.data.remove.args.should.eql([[ { path: 'somepath' } ]]);
        done();

      });

    });

  });

});
