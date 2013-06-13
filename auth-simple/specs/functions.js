var functions = require('../functions');
var figureoutRedirect = functions.figureoutRedirect;

describe('functions', function () {

  describe('figureoutRedirect', function () {

    describe('get', function () {

      it('uses req.url', function () {

        var req = {
          method: 'GET',
          url: '/somewhere',
          app : { path : function () { return '/base'; } }
        };

        figureoutRedirect(req).should.eql('/base/somewhere');

      });

    });

    describe('not get', function () {

      it('uses req.url', function () {

        var req = {
          method: 'POST',
          headers: { referer: '/somewhere-else' },
          app : { path : function () { return '/base'; } }
        };

        figureoutRedirect(req).should.eql('/somewhere-else');

      });

    });

  });

});

