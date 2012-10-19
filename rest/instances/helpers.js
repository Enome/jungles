var helpers = {

  prettyPath: function (path) {

    var parts = path.split('/');
    parts.shift();
    var result = [];

    parts.forEach(function (part) {
      result.push('<span>' + part + '</span>');
    });

    return result.join(' / ');

  },

  init: function (app) {
    app.locals.prettyPath = helpers.prettyPath;
  }

};

module.exports = helpers;
