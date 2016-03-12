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
      require(["esri/map", "esri/geometry/Circle", "esri/symbols/SimpleFillSymbol", 
        "esri/graphic", "esri/layers/GraphicsLayer",
        "dojo/dom", "dojo/dom-attr", "dojo/domReady!"], function(Map, Circle, SimpleFillSymbol, 
        Graphic, GraphicsLayer, 
        dom, domAttr) {
        map = new Map("map", {
          center: [-64.2, -31.41], // - |
          zoom: 17,//13,
          slider: false,
          basemap: 'streets'//"gray" //topo
        });
        var symbol = new SimpleFillSymbol().setColor(null).outline.setColor("blue");
        var gl = new GraphicsLayer({ id: "circles" });
        var geodesic = dom.byId("geodesic");
        map.addLayer(gl);
        console.log('map',map);
        map.on('load',function(e){

        });
        map.on("click", function(e) {
          console.log('point',e.mapPoint);
          var radius = map.extent.getWidth() / 10;
          var circle = new Circle({
            center: e.mapPoint,//{x:-7146717.87773516,y:-3686105.9275120567},//map.mapPoint,//[-7146717.87773516,-3686105.9275120567],//e.mapPoint,
            geodesic: domAttr.get(geodesic, "checked"),
            radius: radius
          });
          var graphic = new Graphic(circle, symbol);
          gl.add(graphic);
        });
      // require(["esri/geometry/Circle"], function(Circle) { 
      //   new Circle([-63, -31],{
      //     "radius": 20000
      //   });
      // });
      // require(["esri/map", "esri/geometry/Circle"], function(Map, Circle){
      //   var circleGeometry = new Circle([-117.15, 32.71],{
      //     "radius": 2000
      //   });
      // });
      // $scope.mapas = Mapas.query();
      });
    };

    // Find existing Mapa
    $scope.findOne = function () {
      $scope.mapa = Mapas.get({
        mapaId: $stateParams.mapaId
      });
    };
  }
]);
