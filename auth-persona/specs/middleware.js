var recorder = require('express-recorder');
var middleware = require('../middleware');
var sinon = require('sinon');

describe('Middleware', function () {

  describe('requireUser', function () {

    describe('req.session.user is defined', function () {

      it('calls next', function (done) {

        var state = {
          session: {
            user: 'Billy'
          }
        };

        recorder(middleware.requireUser, state, function (result) {
          result.data.next.should.eql = true;
          done();
        });

      });

    });

    describe('req.session.user is undefined', function () {

      it('calls redirect', function (done) {

        var dependencies = {
          functions: {
            figureoutRedirect: function () {
              return '/my/url';
            }
          }
        };

        middleware.inject(dependencies);

        var state = {
          session: {
            user: undefined
          }
        };

        recorder(middleware.requireUser, state, function (result) {
          result.data.redirect = '/my/url';
          done();
        });

      });

    });

  });

  describe('Verify', function (done) {

    describe('valid', function () {

      it('sets the local email and calls next if status is okay', function (done) {

        var reply = { status: 'okay', email: 'info@example.com' };

        middleware.inject({
          functions: {
            verify: sinon.stub().yields(reply)
          }
        });

        var state = {
          body: { assertion: 'foobar', redirect_url: '/base' },
          headers: { host: 'jungles.com' }
        };

        recorder(middleware.verify, state, function (result) {

          result.eql({
            session: { user: 'info@example.com' },
            send: { url: '/base' }
          });

          done();

        });

      });

    });

    describe('invalid', function () {

      it('sends the reply to the client when there is an error', function (done) {

        var reply = { status: 'error', response: 'Run its going to explode!' };

        middleware.inject({
          functions: {
            verify: sinon.stub().yields(reply)
          }
        });

        var state = {
          body: { body: { assertion: 'foobar' } },
          headers: { host: 'jungles.com' }
        };

        recorder(middleware.verify, state, function (result) {

          result.eql({
            send: reply
          });

          done();

        });

      });

    });

  });

  describe('destroy', function () {

    it('destroys the email session', function (done) {

      var state = {
        session: { user: 'james@gmail.com' }
      };

      recorder(middleware.destroy, state, function (result) {
        result.eql({ session: { user: undefined }, redirect: '/' });
        done();
      });

    });

  });

      
});
