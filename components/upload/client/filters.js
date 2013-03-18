var files_functions = require('../../../files/functions');

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
      return files_functions.getFilename(path);
    };

  },

};

module.exports = filters;
