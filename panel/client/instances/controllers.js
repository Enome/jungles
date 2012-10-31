var controllers = {

  RootCtrl: function ($scope, $routeParams, types, instances, events, _) {

    $scope.current = { name: 'root', path: '/' };
    $scope.is_root = true;

    types.get({ root: 'true' }, function (data) {
      $scope.types = _.map(data, function (type) {
        return type.name;
      });
    });

    instances.get({ path: /^\/[^\/]+$/ }, function (data) {
      $scope.instances = data;
    });
    
  },

  InstancesCtrl: function ($scope, $routeParams, $location, general, types, instances, _, events) {

    var path = general.path.decode($routeParams.path);

    // Current

    instances.get({ path: path }, function (data) {
      $scope.current = data[0];
      $scope.title = $scope.current.name;
    });

    // Types
    
    $scope.$watch('current', function (current) {
      if (typeof current !== 'undefined') {
        types.get({ name: current.type }, function (types) {
          $scope.types = types[0].children;
        });
      }
    });

    // Children

    var instances_query = { path: new RegExp(path + '/[^/]+$') };

    instances.get(instances_query, function (data) {
      $scope.instances = data;
    });

    // Back Button

    $scope.back = function () {
      var parent_path = general.path.parent(path);

      if (parent_path === '') {
        return $location.path('');
      }

      $location.path('/instances/' + general.path.encode(parent_path));
    };
    
  },

  InstanceCtrl: function ($scope, $location, general, types, events, _) {

    $scope.select = function (instance) {
      if (instance.class === 'selected') {
        instance.class = '';
        events.emit('instances: deselect', instance);
        return;
      }
      instance.class = 'selected';
      events.emit('instances: select', instance);
    };

    $scope.edit = function (instance) {
      $location.path('/instances/edit/' + general.path.encode(instance.path));
    };

    $scope.show = function (instance) {
      $location.path('/instances/' + general.path.encode(instance.path));
    };
    
    // Removed instance from parent

    events.on('instances remove', function (e, path) {

      _.each($scope.$parent.instances, function (instance, i) {
        if (instance.path === path) {
          $scope.$parent.instances.splice(i, 1);
        }
      });

    });
    
    // Deselect all

    events.on('instances: deselect all', function (e, instance) {
      $scope.instance.class = '';
    });

  },

  TypeCtrl: function ($scope, $location, events, general) {
    $scope.create = function (name, parent) {
      $location.path('/instances/new/' + name + '/' + general.path.encode(parent));
    };
  }

};

module.exports = controllers;
