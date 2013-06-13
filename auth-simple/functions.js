module.exports = {

  figureoutRedirect: function (req) {

    var method = req.method;
    var redirect_url = req.app.path() + req.url;

    if (method !== 'GET') {
      redirect_url = req.headers.referer;
    }

    return redirect_url;

  }

};
