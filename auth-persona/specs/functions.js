var sinon = require('sinon');
var functions = require('../functions');
var verify = functions.verify;
var inject = functions.inject;
var processReply = functions.processReply;

describe('functions', function () {

  describe('process browser id', function () {

    var https, request;

    beforeEach(function () {

      request = {
        setHeader: sinon.spy(),
        write: sinon.spy(),
        end: sinon.spy()
      };

      https = {
        request: sinon.stub().returns(request)
      };

      inject({ https: https });
      verify('someassertion', 'jungles.com', function () {});

    });

    it('sets the content type to application/x-www-form-urlencoded', function () {
      return request.setHeader.args[0].should.eql(['Content-Type', 'application/x-www-form-urlencoded']);
    });

    it('sets the content length to 44', function () {
      return request.setHeader.args[1].should.eql(['Content-Length', 44]);
    });

    it('writes the data', function () {
      return request.write.args[0][0].should.eql('assertion=someassertion&audience=jungles.com');
    });

    it('calls end on the request', function () {
      return request.end.called.should.be["true"];
    });

  });


  describe('process reply', function () {

    it('returns a server error when the json is not valid', function () {
      processReply('{test:invalid').should.eql({
        status: 'error',
        reason: 'Server error'
      });
    });

    it('returns the email address if the status is okay', function () {
      var result = processReply('{"status":"okay", "email":"info@example.com"}');
      result.should.eql({
        status: 'okay',
        email: 'info@example.com'
      });
    });

    it('returns an error if the status is error', function () {
      var result = processReply('{"status":"error", "reason":"bad haircut"}');
      result.should.eql({
        status: 'error',
        reason: 'bad haircut'
      });
    });

  });

});
