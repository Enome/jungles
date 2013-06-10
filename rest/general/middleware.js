var middleware = {

  noCache: function (req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store');
    next();
  }

};

module.exports = middleware;
