var jungles_functions = require('jungles-functions');

var factories = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {
      parent: jungles_functions.getParent
    }

  };

  return s;

};

module.exports = factories;
