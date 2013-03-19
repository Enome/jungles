var auth_simple = {

  init: function (admins) {

    if (!Array.isArray(admins)) {
      admins = [admins];
    }

    return function (req, res, next) {

      if (!req.session) {
        throw 'Simple auth needs to have sessions enabled';
      }

      var i;

      for (i = 0; i < admins.length; i += 1) {
        if (req.session.user === admins[i]) {
          return next();
        }

      }

      return next({ type: 'http', error: 403 });

    };

  }

};

module.exports = auth_simple;
