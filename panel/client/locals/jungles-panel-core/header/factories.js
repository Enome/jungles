var factories = function () {

  return {

    pathToNavigation: function (path) {

      var root = { path: '/', name: 'Home' };

      if (path === '/') {
        return [root];
      }

      var navigation = [];

      var i;
      var parts = path.split('/');
      var path_parts = [];

      parts.forEach(function (current) {

        if (current === '') {
          navigation.push(root);
        } else {
          path_parts.push(current);
          navigation.push({ name: current, path: '/' + path_parts.join('/') });
        }

      });

      return navigation;

    }

  };

};

module.exports = factories;
