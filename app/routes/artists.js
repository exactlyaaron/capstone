/*jshint unused:false */
'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.show = (req, res)=>{
  var artistId = req.params.artistId;
  res.render('artists/show', {artistId: artistId, title: 'Artist Detail'});
};

exports.addArtist = (req, res)=>{
  var user = req.user;
  user.addFavoriteArtist(req.params.artistId, req.body.artistName, req.body.artistPhoto, result=>{
    if(result === false) {
      res.send('<p>Already a favorite</p>');
    } else {
      user.save(()=>{
        res.send('<p>Favorited</p>');
      });
    }
  });
};

exports.removeArtist = (req, res)=>{
  console.log('MADE IT TO THE ROUTE');
  var user = req.user;
  user.removeFavoriteArtist(req.params.artistId, ()=>{
    user.save(()=>{
      res.render('users/favorite-artists-profile', {user:user});
    });
  });
};
