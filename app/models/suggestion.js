/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var suggestionCollection = global.nss.db.collection('suggestions');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
//var path = require('path');
//var async = require('async');

class Suggestion {
  constructor(obj){
    this.fromId = obj.fromId;
    this.toId = Mongo.ObjectID(obj.toId);
    this.mbid = obj.mbid;
    this.musicType = obj.musicType;
    this.photo = obj.photo;
    this.name = obj.name;
  }

  save(fn){
    suggestionCollection.save(this, ()=>fn());
  }

  static findAllByToId(id, fn){
    console.log('IN DA SUGGESTION FindByUserId Static Function');
    //id = Mongo.ObjectID(id);
    suggestionCollection.find({toId: id}).toArray((err, suggestions)=>{
      suggestions.forEach(s=>{
        userCollection.findOne({_id: s.fromId}, (err, user)=>{
          s = _.create(Suggestion.prototype, s);

          s.fromUserName = user.appName;
          s.fromUserPhoto = user.primaryPhoto;
          s.save(()=>{
            console.log('updated suggestion');
          });
        });
      });

      fn(suggestions);
    });
  }

  static destroy(id, fn){
    id = Mongo.ObjectID(id);
    suggestionCollection.findAndRemove({_id:id}, ()=>{
      fn();
    });
  }

}


module.exports = Suggestion;
