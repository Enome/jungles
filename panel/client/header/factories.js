var factories = function () {

  return {

    pathToNavigation: function (path) {

      var root = { path: '/', name: 'Root' };

      if (path === '/') {
        return [root];
      }

      var navigation = [];

      var i;
      var parts = path.split('/');
      var path_parts = [];

      for (i = 0; i < parts.length; i += 1) {
        var current = parts[i];

        if (current === '') {
          navigation.push(root);
        } else {
          path_parts.push(current);
          navigation.push({ name: current, path: '/' + path_parts.join('/') });
        }
      }

      return navigation;

    }

  };

};

module.exports = factories;
