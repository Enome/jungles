var pushValue = require('../src/utils').pushValue;
var doWhenNotEmpty = require('../src/utils').doWhenNotEmpty;

describe('Utils', function () {

  describe('Push value', function () {

    it('adds the value to the array property of the object', function () {
      var obj = {};
      pushValue(obj, 'name', 'is required');
      obj.should.eql({ name: ['is required'] });
    });

    it('adds two values to the name dict', function () {
      var obj = {};
      pushValue(obj, 'name', 'is required');
      pushValue(obj, 'name', 'is realy required');
      obj.should.eql({ name: ['is required', 'is realy required'] });
    });

  });

  describe('Do When Not Empty', function () {

    it('does it when its undefined', function () {

      var t = true;

      doWhenNotEmpty(undefined, function () {
        t = false;
      });

      t.should.be.true;
      
    });

    it('does it when its null', function () {

      var t = true;

      doWhenNotEmpty(null, function () {
        t = false;
      });

      t.should.be.true;
      
    });

    it('does it when its empty string', function () {

      var t = true;

      doWhenNotEmpty('', function () {
        t = false;
      });

      t.should.be.true;
      
    });

  });

});
