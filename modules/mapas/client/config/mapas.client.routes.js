'use strict';

// Setting up route
angular.module('mapas').config(['$stateProvider',
  function ($stateProvider) {
    // Mapas state routing
    $stateProvider
      .state('mapas', {
        abstract: true,
        url: '/mapas',
        template: '<ui-view/>'
      })
      .state('mapas.list', {
        url: '',
        templateUrl: 'modules/mapas/client/views/list-mapas.client.view.html'
      })
      .state('mapas.create', {
        url: '/create',
        templateUrl: 'modules/mapas/client/views/create-mapa.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('mapas.view', {
        url: '/:mapaId',
        templateUrl: 'modules/mapas/client/views/view-mapa.client.view.html'
      })
      .state('mapas.edit', {
        url: '/:mapaId/edit',
        templateUrl: 'modules/mapas/client/views/edit-mapa.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
