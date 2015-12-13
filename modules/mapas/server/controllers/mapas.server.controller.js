'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mapa = mongoose.model('Mapa'),
  request = require('request'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// generate a token with your client id and client secret
function getToken(callback){
  request.post({
    url: 'https://www.arcgis.com/sharing/rest/oauth2/token/',
    json:true,
    form: {
      'f': 'json',
      'client_id': 'u6PzgzifEzvKst92',
      'client_secret': 'fffa18521c7c4ee5a0ddd5c565b5c8cb',
      'grant_type': 'client_credentials',
      'expiration': '1440'
    }
  }, function(error, response, body){
    console.log('BAT',body.access_token);
    callback(body.access_token);
  });
}

getToken(function(token){
  // sample post to GeoEnrichment REST API
  // returns demographic information for a one mile radius around a point
  request.post({
    url: 'http://geoenrich.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer/Geoenrichment/enrich',
    json:true,
    form: {
      f: 'json',
      token: token,
      studyAreas: '[{"geometry":{"x":-117.1956,"y":34.0572}}]'
    }
  }, function(error, response, body){
    console.log('BODY',body);
  });
});

// require(["esri/map", "dojo/domReady!"], function(Map) {
//   var map = new Map("map", {
//     center: [-118, 34.5],
//     zoom: 8,
//     basemap: "topo"
//   });
// });




/**
 * Create a mapa
 */
exports.create = function (req, res) {
  var mapa = new Mapa(req.body);
  mapa.user = req.user;

  mapa.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mapa);
    }
  });
};

/**
 * Show the current mapa
 */
exports.read = function (req, res) {
  res.json(req.mapa);
};

/**
 * Update a mapa
 */
exports.update = function (req, res) {
  var mapa = req.mapa;

  mapa.title = req.body.title;
  mapa.content = req.body.content;

  mapa.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mapa);
    }
  });
};

/**
 * Delete an mapa
 */
exports.delete = function (req, res) {
  var mapa = req.mapa;

  mapa.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mapa);
    }
  });
};

/**
 * List of Mapas
 */
exports.list = function (req, res) {
  Mapa.find().sort('-created').populate('user', 'displayName').exec(function (err, mapas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mapas);
    }
  });
};

/**
 * Mapa middleware
 */
exports.mapaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mapa is invalid'
    });
  }

  Mapa.findById(id).populate('user', 'displayName').exec(function (err, mapa) {
    if (err) {
      return next(err);
    } else if (!mapa) {
      return res.status(404).send({
        message: 'No mapa with that identifier has been found'
      });
    }
    req.mapa = mapa;
    next();
  });
};
