var instances = [];
var types = [];
var alerts = [];
var globals = {};

var services = function () {
  
  return {
    instances: instances,
    types: types,
    alerts: alerts,
    globals: globals,
  };

};

module.exports = services;
