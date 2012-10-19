var recorder = require('express-recorder');
var middleware = require('../index');

describe('General Middleware', function () {

  describe('Render', function () {
    
    it('renders the path', function () {
      var handler = middleware.render('users/profile');

      recorder(handler, function (result) {
        result.eql({ render: 'users/profile' });
      });

    });

  });

  describe('Redirect', function () {

    it('redirects to the path', function () {

      var handler = middleware.redirect('/home/index');

      recorder(handler, function (result) {
        result.eql({ redirect: '/home/index' });
      });

    });

  });

  describe('Send', function () {

    it('sends the return value', function () {

      var handler = middleware.send(function () { return this.res.locals.user; });

      var state = {
        locals: {
          user: '__user__'
        }
      };

      recorder(handler, state, function (result) {
        result.data.send.should.eql('__user__');
      });

    });

  });

});
