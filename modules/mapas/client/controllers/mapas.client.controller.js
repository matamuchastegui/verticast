'use strict';

// Mapas controller
angular.module('mapas').controller('MapasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mapas',
  function ($scope, $stateParams, $location, Authentication, Mapas) {
    $scope.authentication = Authentication;

    // Create new Mapa
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'mapaForm');

        return false;
      }

      // Create new Mapa object
      var mapa = new Mapas({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      mapa.$save(function (response) {
        $location.path('mapas/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Mapa
    $scope.remove = function (mapa) {
      if (mapa) {
        mapa.$remove();

        for (var i in $scope.mapas) {
          if ($scope.mapas[i] === mapa) {
            $scope.mapas.splice(i, 1);
          }
        }
      } else {
        $scope.mapa.$remove(function () {
          $location.path('mapas');
        });
      }
    };

    // Update existing Mapa
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'mapaForm');

        return false;
      }

      var mapa = $scope.mapa;

      mapa.$update(function () {
        $location.path('mapas/' + mapa._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Mapas
    $scope.find = function () {
      var map;
      require(["esri/map", "dojo/domReady!"], function(Map) {
        map = new Map("map", {
          center: [-118, 34.5],
          zoom: 8,
          basemap: "topo"
        });
      });
      $scope.mapas = Mapas.query();
    };

    // Find existing Mapa
    $scope.findOne = function () {
      $scope.mapa = Mapas.get({
        mapaId: $stateParams.mapaId
      });
    };
  }
]);
