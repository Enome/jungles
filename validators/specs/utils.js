var pushValue = require('../src/utils').pushValue;
var setValue = require('../src/utils').setValue;

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
