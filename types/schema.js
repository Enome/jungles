var validators = require('jungles-validators');
var uniqueName = require('./validators').uniqueName;

module.exports = function (data) {
  return {
    path: [ validators.string() ],
    parent: [ validators.string() ],
    type: [ validators.string() ],
    name: [ validators.required(), uniqueName(data), validators.string() ],
    order: [ validators.required(), validators.integer() ]
  };
};
