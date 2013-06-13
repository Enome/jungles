var functions = require('./functions');

var middleware = {

  inject: function (deps) {

    if (deps.functions) {
      functions = deps.functions;
    }

  },

  requireUser: function (req, res, next) {
    if (req.session.user) {
      return next();
    }

    res.redirect(functions.figureoutRedirect(req));
  },

  verify: function (req, res, next) {

    functions.verify(req.body.assertion, req.header('host'), function (reply) {

      if (reply.status === 'okay') {
        req.session.user = reply.email;
        return res.send({ url: req.body.redirect_url });
      }

      return res.send(reply);

    });

  },

  destroy: function (req, res, next) {
    req.session.user = undefined;
    res.redirect('/');
  }

};

module.exports = middleware;
