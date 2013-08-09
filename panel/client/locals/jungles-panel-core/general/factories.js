var getParent = function (path) {

  path = path.substring(1);

  var parts = path.split('/');

  parts.pop();

  if (parts.length === 0) {
    return '/';
  }

  return '/' + parts.join('/');

};

var factories = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {
      parent: getParent
    }

  };

  return s;

};

module.exports = factories;
