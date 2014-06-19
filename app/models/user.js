/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');

class User {
  constructor(){
    this.local = {
      email:    String,
      password: String
    };
    this.facebook = {
      id:       String,
      token:    String,
      email:    String,
      name:     String
    };
    this.twitter = {
      id:          String,
      token:       String,
      displayName: String,
      username:    String
    };
    this.appName = '';
    this.bio = '';
    this.primaryPhoto = '/img/assets/defaultPhoto.png';
    this.favoriteArtists = [];
    this.favoriteGenres = [];
    this.posts = [];
  }

  save(fn){
    userCollection.save(this, ()=>fn());
  }
  // methods ======================
  // generating a hash
  generateHash(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(password) {
      return bcrypt.compareSync(password, this.local.password);
  }

  update(fields, files){
    if(fields && typeof(fields.appName) !== 'undefined') {

      this.appName = fields.appName[0];
      this.bio = fields.bio[0];

      this.favoriteGenres = fields.favoriteGenres[0].toLowerCase().replace(/,/g,' ').split(' ').filter(Boolean);

      if(files.photo[0].size !== 0){

        var extension  = path.extname(files.photo[0].path);

        this.primaryPhoto = `/img/${this._id.toString()}/profile${extension}`;

        var userDir = `${__dirname}/../static/img/${this._id.toString()}`;
        userDir = path.normalize(userDir);

        this.primaryPhotoPath = `${userDir}/profile${extension}`;
        this.primaryPhotoDir = userDir;
        if(!fs.existsSync(userDir)){
          fs.mkdirSync(userDir);
        }
        fs.renameSync(files.photo[0].path, this.primaryPhotoPath);
      }
    }
  }

  // static findById(id, fn){
  //   id = Mongo.ObjectID(id);
  //   userCollection.findOne({_id: id}, (err, user)=>{
  //     fn(null, user);
  //   });
  // }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }

  static findByEmail(email, fn){
    userCollection.findOne({'local.email': email}, (err, user)=>{
      fn(err, user);
    });
  }


}

module.exports = User;
