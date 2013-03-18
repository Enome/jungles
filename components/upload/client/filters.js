var filters = {

  fileType: function () {

    return function (path) {

      var ex = path.substring(path.lastIndexOf('.')).toLowerCase();

      if (ex === '.png' || ex === '.jpg' || ex === '.jpeg' || ex === '.gif') {
        return path;
      }

      return 'custom/assets/upload/file.png';

    };

  }

};

module.exports = filters;
