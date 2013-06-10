var functions = require('jungles-functions');

var filters = {

  isImage: function () {

    return function (path) {
      var ex = path.substring(path.lastIndexOf('.')).toLowerCase();
      return ex === '.png' || ex === '.jpg' || ex === '.jpeg' || ex === '.gif';
    };

  },

  fileName: function () {
    
    return function (path) {
      return functions.getFilename(path);
    };

  },

};

module.exports = filters;
