var functions = {

  sanitize: function (path) {

    if (path === '/') {
      return '';
    }

    if (path.charAt(path.length - 1) === '/') {
      path = path.slice(0, -1);
    }

    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }

    return path;

  }

};

module.exports = functions;
