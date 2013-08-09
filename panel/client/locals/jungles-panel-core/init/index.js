require('webfont');

var init = function (jungles) {

  jungles.run(function ($http, general, types) {

    window.WebFont.load({ google: { families: ['Roboto Condensed:300'] } });
    var result = $http.get(general.resource_url('/types'));

    result.success(function (response) {
      types.set(response);
    });

  });

};

module.exports = init;
