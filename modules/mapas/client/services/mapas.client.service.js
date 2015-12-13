'use strict';

//Mapas service used for communicating with the mapas REST endpoints
angular.module('mapas').factory('Mapas', ['$resource',
  function ($resource) {
    return $resource('api/mapas/:mapaId', {
      mapaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
