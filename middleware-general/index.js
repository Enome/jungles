module.exports = {

  render: function (view) {

    return function (req, res, next) {
      res.render(view);
    };

  },

  redirect: function (url) {

    return function (req, res, next) {
      res.redirect(url);
    };

  },

  send: function (getValue) {
    
    return function (req, res, next) {
      res.send(getValue.call({ req: req, res: res }));
    };

  }

};
