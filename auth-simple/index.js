var auth_simple = {

  init: function (admins) {

    if (!Array.isArray(admins)) {
      admins = [admins];
    }

    return function (req, res, next) {

      if (!req.session) {
        throw 'Simple auth needs to have sessions enabled';
      }

      admins.forEach(function (admin) {
        if (req.session.user === admin) {
          return next();
        }
      });

      return next({ type: 'http', error: 403 });

    };

  }

};

module.exports = auth_simple;
