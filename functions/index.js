var functions = {

  getFilename: function (name) {

    var extension = name.lastIndexOf('.') === -1 ? '' : '.' + name.split('.').pop();
    var uuid = name.substring(0, 36);
    var filename = name.replace(uuid, '');

    if (filename.length === extension.length) {
      return uuid + extension;
    }

    return filename;

  }

};

module.exports = functions;
