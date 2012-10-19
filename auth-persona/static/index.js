var browserid = {

  gotAssertion: function (assertion, el) {

    if (assertion) {

      $.ajax({

        type: 'POST',
        url: '/login',
        data: {
          assertion: assertion,
          redirect_url: el.data('url')
        },

        success: function (res, status, xhr) {
          window.location.replace(res.url);
        },

        error: function (res, status, xhr) {
          alert('There was a problem logging in');
        }

      });
    }

  },

  init: function () {

    $('.persona').click(function (e) {
      var el;
      e.preventDefault();
      el = $(this);

      navigator.id.get(function (assertion) {
        browserid.gotAssertion(assertion, el);
      });

    });

  }

};

$(function (){
  browserid.init();
});
