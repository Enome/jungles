var validators = require('jungles-validators');

module.exports = {
  path: [ validators.string() ],
  parent: [ validators.string() ],
  type: [ validators.string() ],
  name: [ validators.required(), validators.string() ],
  order: [ validators.required(), validators.integer() ]
};
