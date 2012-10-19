var sinon = require('sinon');
var functions = require('../functions');

describe('Types Functions', function () {

  describe('renderForm', function () {
    
    describe('type without a form', function () {

      it('returns an empty string', function () {

        var type = {};
        var callback = sinon.mock();

        functions.renderForm(null, type, callback);
        callback.args.should.eql([[ null, '' ]]);

      });

    });

    describe('type with a form', function () {

      it('returns an empty string', function () {

        var app = { render: sinon.stub().yields('__error__', 'template string') };
        var type = { form: '__form__' };
        var callback = sinon.mock();

        functions.renderForm(app, type, callback);
        callback.args.should.eql([[ '__error__', 'template string' ]]);

      });

    });

  });

});
