var middleware = require('../middleware');
var recorder = require('express-recorder');
var sinon = require('sinon');

describe('Types Middleware', function () {

  describe('defaultQuery', function () {

    it('sets req.query to default if it has no properties', function (done) {

      var req = { query: {} };

      middleware.defaultQuery(req, {}, function () {
        req.should.eql({ query: { name: '.*' } });
        done();
      });
      
    });

  });

  describe('find', function () {

    describe('many', function () {

      it('sets the local type', function (done) {
        
        // Setup dependencies

        var response = '__response__';

        var result = {
          many: sinon.stub().yields(response),
          empty: function () {}
        };

        var core = {
          schemas: { find: sinon.stub().returns(result) }
        };

        middleware.inject(core);

        // Setup middleware
        
        var handler = middleware.find(function () { return { id: this.req.body.id }; });

        // Setup State

        var state = {
          body: { id: 'someid' }
        };

        // Record

        recorder(handler, state, function (result) {
          result.eql({
            locals: { types: '__response__' },
            next: true
          });

          // Extra: verify types.find

          core.schemas.find.args.should.eql([[ { id: 'someid' } ]]);

          done();

        });

      });

    });

    describe('empty', function () {

      it('calls next with a types not found error', function (done) {
        
        // Setup dependencies

        var result = {
          empty: sinon.stub().yields(),
          many: function () {}
        };

        var core = {
          schemas: { find: sinon.stub().returns(result) }
        };

        middleware.inject(core);

        // Setup middleware
        
        var handler = middleware.find(function () { return { id: this.req.body.id }; });

        // Setup State

        var state = {
          body: { id: 'someid' }
        };

        // Record

        recorder(handler, state, function (result) {

          result.eql({
            next: { type: 'types', error: 'No types were found.' }
          });

          done();

        });

      });

    });

  });

  describe('renderForm', function () {
    
    describe('error', function () {

      it('calls next with a template error', function (done) {
        
        // Setup dependencies

        var functions = {
          renderForm: sinon.stub().yields('__some_error__')
        };

        middleware.inject(null, functions);

        // Setup state

        var state = {
          locals: { types: ['book'] },
          request: { app: { parent: '__parent__' } }
        };

        // Record
        
        recorder(middleware.renderForm, state, function (result) {

          result.data.next.should.eql({ type: 'template', error: '__some_error__' });

          // Extra: verify functions.renderForm

          functions.renderForm.args[0].slice(0, 2).should.eql([ '__parent__', 'book' ]);

          done();

        });

      });

    });

    describe('no error', function () {

      it('sets the local form with the template string', function (done) {
        
        // Setup dependencies

        var functions = {
          renderForm: sinon.stub().yields(null, '__template_string__')
        };

        middleware.inject(null, functions);

        // Setup state

        var state = {
          locals: { types: ['book'] },
          request: { app: { parent: '__parent__' } }
        };

        // Record
        
        recorder(middleware.renderForm, state, function (result) {
          result.data.locals.form.should.eql('__template_string__');
          done();
        });

      });

    });

  });

});
