var factories = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {

      parent: function (path) {

        if (path.indexOf('/') === 0) {
          path = path.replace(/^\//, '');
        }

        var parts = path.split('/');
        parts.pop();

        if (parts.length === 0) {
          return '/';
        }

        return '/' + parts.join('/');

      }

    }
  };

  return s;

};

module.exports = factories;
