var functions = {

  getFilename: function (name) {

    var extension = name.lastIndexOf('.') === -1 ? '' : '.' + name.split('.').pop();
    var uuid = name.substring(0, 36);
    var filename = name.replace(uuid, '');

    if (filename.length === extension.length) {
      return uuid + extension;
    }

    return filename;

  },

  getParent: function (path) {

    path = path.substring(1);

    var parts = path.split('/');

    parts.pop();

    if (parts.length === 0) {
      return '/';
    }

    return '/' + parts.join('/');

  },

};

module.exports = functions;
