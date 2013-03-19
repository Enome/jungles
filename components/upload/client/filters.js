var functions = require('jungles-functions');

var filters = {

  fileType: function () {

    return function (path) {

      var ex = path.substring(path.lastIndexOf('.')).toLowerCase();

      if (ex === '.png' || ex === '.jpg' || ex === '.jpeg' || ex === '.gif') {
        return path;
      }

      return 'custom/assets/upload/file.png';

    };

  },

  fileName: function () {
    
    return function (path) {
      return functions.getFilename(path);
    };

  },

};

module.exports = filters;
