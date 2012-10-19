var walkSubstack = require('../functions').walkSubstack;

describe('Functions', function () {

  describe('walkSubstack', function () {

    describe('Array', function () {

      it('works with an array', function (done) {

        var stack = [
          function (req, res, next) {
            next();
          },

          function (req, res, next) {
            next();
          }
        ];

        walkSubstack(stack, {}, {}, done);

      });

    });

    describe('Function', function () {

      it('works with a function', function (done) {

        walkSubstack(function (req, res, next) {

          next();

        }, {}, {}, done);
          
      });

    });

    describe('Error', function () {

      it('calls next with the error', function () {

        walkSubstack(function (req, res, next) {

          next({ type: 'http', error: 404 });

        }, {}, {}, function (error) {

          error.should.eql({ type: 'http', error: 404 });

        });

      });

    });

  });

});
