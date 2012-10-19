var services = function ($document) {

  var s = {
    resource_url: function (url) {
      return $document[0].getElementById('ResourceUrl').value + url;
    },

    path: {

      decode: function (encoded_path) {
        return decodeURIComponent(encoded_path);
      },

      encode: function (path) {
        return encodeURIComponent(path);
      },

      parent: function (path) {
        var parts = path.split('/');
        parts.pop();

        if (parts.length === 0) {
          return '/';
        }

        return parts.join('/');
      }

    }
  };

  return s;

};

module.exports = services;
