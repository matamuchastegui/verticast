'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  nodemailer = require('nodemailer'),
  _smtpTransport = require("nodemailer-smtp-transport"),
  config = require('../../../../config/config'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;
  console.log('CREATE');
  article.save(function (err) {
    console.log('err1',err);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('enviar mail');
      //Enviar mail
      res.render('modules/core/server/views/templates/send-mail', {
        name: article.title,
        consult: article.content
      }, function(err, emailHTML) {
        console.log('step1');
        var smtpTransport = nodemailer.createTransport((_smtpTransport({
          service: 'Gmail',
          host: 'smtp.gmail.com',
          secureConnection: false, // use SSL
          port: 587, // port for secure SMTP
          auth: {
            user: 'decompras.noreply@gmail.com',
            pass: 'FWew8lKW'
          }
        })));
        // var smtpTransport = nodemailer.createTransport('smtps://decompras.noreply%40gmail.com:FWew8lKW@smtp.gmail.com');
        var mailOptions = {
          to: 'mati.am.08@gmail.com',
          from: config.mailer.from,
          subject: 'Solicitud de recuperar contraseña',
          html: emailHTML
        };
        console.log('mailOptions',mailOptions);
        smtpTransport.sendMail(mailOptions, function(err, data) {
          console.log('err2',err,'data',data);
          if (!err) {
            res.json({
              RespCode: 0,
              RespMessage: 'Ok, se le ha reenviado su contraseña a su email'
            });
          } else {
            return res.status(400).send({
              message1: 'Error: no se ha podido enviar email.' 
            });
          }
        });
        
      },function(err) {
        console.log('err',err);
        if (err)
          return res.status(400).send({
            message2: 'Error: no se ha podido enviar email.'
          });
      });
      //Fin enviar mail
      // res.json(true);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
