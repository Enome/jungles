var functions = {

  renderForm: function (app, type, callback) {

    if (typeof type.form === 'undefined') {
      return callback(null, '');
    }

    app.render(type.form, function (err, str) {
      callback(err, str);
    });

  }

};

module.exports = functions;
