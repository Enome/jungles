var Mocha = require('mocha');
var should = require('should');

var specs = function (data, settings) {

  global.data = data;
  global.settings = settings;

  var mocha = new Mocha({ reporter: 'spec' });
  mocha.suite._bail = settings.bail || false;
  mocha.suite.reporter = 'spec';
  mocha.addFile(__dirname + '/specs/dump.js');
  mocha.addFile(__dirname + '/specs/find.js');
  mocha.addFile(__dirname + '/specs/create.js');
  mocha.addFile(__dirname + '/specs/remove.js');
  mocha.addFile(__dirname + '/specs/update.js');
  mocha.addFile(__dirname + '/specs/copy.js');
  mocha.addFile(__dirname + '/specs/tree.js');

  var runner = mocha.run(function () {
    process.exit();
  });

};

module.exports = specs;
