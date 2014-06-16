/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt-nodejs');

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
      id:       String,
      token:    String,
      displayName: String,
      username:   String
    };
    this.google = {
      id: String,
      token: String,
      email: String,
      name: String
    };
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

  static findById(id, fn){
    id = Mongo.ObjectID(id);
    userCollection.findOne({_id: id}, (err, user)=>{
      fn(null, user);
    });
  }

  static findByEmail(email, fn){
    userCollection.findOne({'local.email': email}, (err, user)=>{
      fn(err, user);
    });
  }


}

module.exports = User;
