var dal = require('./index');
var specs = require('jungles-data');

var data = [];

var createData = function () {
  var boards = { type: 'category', path: '/boards', name: 'Boards', sort: [0], color: 'red', order: 0 };
  var blades = { type: 'category', path: '/blades', name: 'Blades', sort: [1], color: 'blue', order: 1 };
  var skateboard = { type: 'product', path: '/boards/skateboard', name: 'Skateboard', sort: [0, 0], order: 0 };
  var wheel = { type: 'part', path: '/boards/skateboard/wheel', name: 'Wheel', sort: [0, 0, 0], order: 0 };

  return [boards, skateboard, wheel, blades];
};

var settings = {
  bail: true,
  beforeEach: function (done) {
    data.length = 0;
    data.push.apply(data, createData());
    done();
  }
};

specs(dal(data), settings);
