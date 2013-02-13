var https = require('https');
var qs = require('querystring');

module.exports = {

  inject: function (args) {
    if (args && args.https) {
      https = args.https;
    }
  },

  processReply: function (s) {

    try {

      var reply = JSON.parse(s);

      if (reply.status === 'okay') {
        return { status: 'okay', email: reply.email };
      }
      return { status: 'error', reason: reply.reason };

    } catch (e) {
      return { status: 'error', reason: 'Server error' };
    }

  },

  verify: function (assertion, audience, callback) {

    var options = {
      host: 'verifier.login.persona.org',
      path: '/verify',
      method: 'POST'
    };

    var request = https.request(options, function (res) {

      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        callback(module.exports.processReply(body));
      });

    });

    var data = qs.stringify({
      assertion: assertion,
      audience: audience
    });

    request.setHeader("Content-Type", "application/x-www-form-urlencoded");
    request.setHeader("Content-Length", data.length);
    request.write(data);

    request.end();

  },

  figureoutRedirect: function (req) {

    var method = req.route.method;
    var redirect_url = req.url;

    if (method !== 'get') {
      redirect_url = req.headers.referer;
    }

    return '/login?redirect_url=' + redirect_url;

  }

};

