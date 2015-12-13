'use strict';

// Configuring the Mapas module
angular.module('mapas').run(['Menus',
  function (Menus) {
    // Add the mapas dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Mapas',
      state: 'mapas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'mapas', {
      title: 'List Mapas',
      state: 'mapas.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'mapas', {
      title: 'Create Mapas',
      state: 'mapas.create',
      roles: ['user']
    });
  }
]);
