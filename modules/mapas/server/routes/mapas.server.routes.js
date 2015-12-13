'use strict';

/**
 * Module dependencies.
 */
var mapasPolicy = require('../policies/mapas.server.policy'),
  mapas = require('../controllers/mapas.server.controller');

module.exports = function (app) {
  // Mapas collection routes
  app.route('/api/mapas').all(mapasPolicy.isAllowed)
    .get(mapas.list)
    .post(mapas.create);

  // Single mapa routes
  app.route('/api/mapas/:mapaId').all(mapasPolicy.isAllowed)
    .get(mapas.read)
    .put(mapas.update)
    .delete(mapas.delete);

  // Finish by binding the mapa middleware
  app.param('mapaId', mapas.mapaByID);
};
