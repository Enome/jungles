var eql = require('eql');
var Mocha = require('mocha');

var tester = function (_data, bail) {

  global.data = _data;
  var mocha = new Mocha();
  mocha.suite._bail = bail || false;
  mocha.addFile(__dirname + '/tests.js');
  var runner = mocha.run(function () {
    process.exit();
  });
};

module.exports = tester;
