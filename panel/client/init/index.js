var init = function (jungles) {

  jungles.run(function ($http, general, types) {

    var result = $http.get(general.resource_url('/types'));

    result.success(function (response) {
      types.set(response);
    });

  });

};

module.exports = init;
