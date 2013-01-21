var sinon = require('sinon');
var recorder = require('express-recorder');
var middleware = require('../middleware');
var kwery = require('kwery');

describe('Middleware', function () {

  describe('tree', function () {

    it('sets the local tree and calls next', function (done) {

      // Setup dependencies

      var response = '__tree_data__';

      var result = {
        success: sinon.stub().yields(response)
      };

      var data = {
        tree: sinon.stub().returns(result)
      };

      // Setup Middleware

      var handler = middleware.tree(data);

      // Record

      recorder(handler, function (result) {

        result.eql({
          locals: { tree: '__tree_data__' },
          next: true
        });

        // Extra: verify data.tree

        data.tree.args.should.eql([[ { path: /.*/ } ]]);

        done();

      });

    });

  });

  describe('current', function () {

    var tree;

    beforeEach(function () {

      tree = [
        {
          id: 0,
          name: 'snowboard',
          path: '/snowboard',
          children: [
            {
              id: 1,
              name: 'tags',
              path: '/snowboard/tags',

              children: [
                { id: 2, name: 'red', path: '/snowboard/tags/red' },
                { id: 3, name: 'green', path: '/snowboard/tags/green' }
              ]

            }
          ]
        }
      ];

    });

    describe('Not empty', function () {

      it('gets the current instance by path and calls next', function (done) {

        // Setup state
       
        var state = {
          params: { path: '/snowboard' },
          locals: { tree: tree }
        };

        // Record

        recorder(middleware.current, state, function (result) {

          result.eql({
            locals: {
              tree: tree,
              current: tree[0]
            },
            next: true
          });

          done();

        });

      });

    });

    describe('empty', function () {

      it('calls next with an http 404 error if the instance isn\'t found', function (done) {

        // Setup state
       
        var state = {
          params: { path: '/skateboard' },
          locals: { tree: tree }
        };

        // Record

        recorder(middleware.current, state, function (result) {
          result.data.next.should.eql({ type: 'http', error: 404 });
          done();
        });

      });

    });

  });

  describe('type', function () {

    describe('one', function () {

      it('sets the local type if the current instance\' type and calls next', function (done) {

        // Setup dependencies
        
        var type = '__type__';

        var result = {
          one: sinon.stub().yields(type),
          empty: sinon.stub()
        };

        var types = {
          find: sinon.stub().returns(result)
        };

        // Setup State

        var state = {
          locals: { current: { type: 'book' } }
        };

        // Setup Middleware
        
        var handler = middleware.type(types);

        // Record

        recorder(handler, state, function (result) {

          result.eql({
            locals: { current: state.locals.current, type: '__type__' },
            next: true
          });

          // Extra: verify types.find

          types.find.args.should.eql([[ { name: 'book' } ]]);

          done();

        });

      });

    });

    describe('empty', function () {

      it('calls next with core error saying that the type wasnt found', function (done) {

        // Setup dependencies
        
        var result = {
          one: sinon.stub(),
          empty: sinon.stub().yields()
        };

        var types = {
          find: sinon.stub().returns(result)
        };

        // Setup State

        var state = {
          locals: { current: { type: 'book' } }
        };

        // Setup Middleware
        
        var handler = middleware.type(types);

        // Record

        recorder(handler, state, function (result) {

          result.eql({
            locals: { current: state.locals.current },
            next: { type: 'core', error: 'Type was not found' }
          });

          done();

        });

      });

    });

  });

  describe('middleware', function () {

    describe('type with middleware', function () {

      it('walks the middleware', function (done) {
        
        // Setup dependencies
        
        var walkSubstack = sinon.stub().yields();

        middleware.inject(walkSubstack);

        // State

        var state = {
          locals: { type: { middleware: '_middleware_' } }
        };

        // Record

        recorder(middleware.middleware, state, function (result) {
          result.data.next.should.be.true;

          // Extra: verify walkSubstack
          walkSubstack.args[0][0].should.eql('_middleware_');
          done();
        });

      });

    });

    describe('type without middleware', function () {

      it('it calls next', function (done) {
        
        // State

        var state = {
          locals: { type: { } }
        };

        // Record

        recorder(middleware.middleware, state, function (result) {
          result.data.next.should.be.true;
          done();
        });


      });

    });

  });

  describe('render', function () {

    describe('template', function () {

      it('renders a template with the name of the type', function (done) {

        // Setup state

        var state = {
          locals: { type: { name: 'book' } },
          query: { json: 'false' }
        };

        // Record

        recorder(middleware.render, state, function (result) {
          result.data.render.should.eql('book');
          done();
        });

      });

    });

    describe('json', function () {

      it('returns the current instance as json', function (done) {

        // Setup state

        var state = {
          locals: { current: '_current_' },
          query: { json: 'true' }
        };

        // Record

        recorder(middleware.render, state, function (result) {
          result.data.json.should.eql('_current_');
          done();
        });

      });

    });

  });

  describe('constants', function () {
    
    it('adds constants to the instances', function (done) {

      // Dependencies

      var tree = [
        {
          name: 'skateboard',
          type: 'product',
          children: [
            {
              name: 'board',
              type: 'tag',
            },
            {
              name: 'extreme',
              type: 'tag',
            },
          ]
        },

        {
          name: 'bike',
          type: 'vehicle',
        }

      ];

      var types = { find: kwery.flat.bind(null, [
        {
          name: 'product',
          constants: {
            hide: true
          }
        },

        {
          name: 'tag',
          constants: {
            color: 'red'
          }
        },
      ]) };

      // Setup state

      var state = {
        locals: { tree: tree }
      };

      // Handler
      
      var handler = middleware.constants(types);

      // Record

      recorder(handler, state, function (result) {
        result.eql({
          next: true,
          locals: {
            tree: [
              {
                name: 'skateboard',
                type: 'product',
                hide: true,
                children: [
                  {
                    name: 'board',
                    type: 'tag',
                    color: 'red'
                  },
                  {
                    name: 'extreme',
                    type: 'tag',
                    color: 'red'
                  },
                ]
              },

              {
                name: 'bike',
                type: 'vehicle',
              }

            ]
          }
        });
        done();
      });

    });

  });

});
