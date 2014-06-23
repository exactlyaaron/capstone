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
var async = require('async');

var showingFriends;
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
    this.friends = [];
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

      this.favoriteGenres = fields.favoriteGenres[0].toLowerCase().split(',').filter(Boolean);

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

  addFavoriteArtist(artistId, artistName, artistPhoto, fn){
    var artist = {};
    artist.mbid = artistId;
    artist.name = artistName;
    artist.photo = artistPhoto;

    var isPresent = false;
    if(this.favoriteArtists.length > 0){
      this.favoriteArtists.forEach(x=>{
        var foo = x.mbid.toString();
        var bar = artistId.toString();
        if(foo === bar){
          isPresent = true;
        }
      });
    }

    if(isPresent === false){
      console.log('BBBBBBBBBBBBBB SHOULDNT SEE THIS');

      this.favoriteArtists.push(artist);
      console.log('----------------------');
      console.log(this.favoriteArtists);
      fn(true);
    } else {
      fn(false);
    }
  }

  removeFavoriteArtist(artistId, fn){
    console.log('MADE IT TO THE INSTNCE FUNCTION');
    var artists = this.favoriteArtists;
    _.remove(artists, artist=>{
      return artist.mbid === artistId;
    });

    //console.log(removed);
    fn();
  }

  isFriend(otherId, fn){
    console.log('MADE IT TO THE ISFRIEND FUNCTION');
    var isAFriend = false;
    if(this.friends.length > 0){
      this.friends.forEach(friend=>{
        console.log('---------');
        console.log(friend);
        console.log(otherId);
        if(friend.toString() === otherId.toString()){
          isAFriend = true;
        }
      });
    }

    fn(isAFriend);
    return;
  }


  findFriends(fn){
    showingFriends = [];
    async.map(this.friends, buildFriendArray, (err, results)=>{
      console.log('FINISHED ASYNC MAP');
      console.log('RESULTS**************');
      fn(showingFriends);
    });
  }

  addFriend(otherId, fn){
    this.friends.push(otherId);
    fn();
  }

  removeFriend(otherId, fn){
    var friends = this.friends;
    _.remove(friends, friend=>{
      return friend.toString() === otherId.toString();
    });

    //console.log(removed);
    fn();
  }

  sharePost(postId, fn){
    this.posts.push(postId);
    fn();
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }

  static findAllOthers(loggedIn, fn){
    userCollection.find().toArray((err, users)=>{
      users = users.map(u=>_.create(User.prototype, u));
      _.remove(users, user=>{
        return user._id.toString() === loggedIn._id.toString();
      });
      fn(users);
    });
  }

  static searchUsers(query, fn){
    console.log('METHOD QUERY------------');
    console.log(query);
    userCollection.find({ $or: [ { appName: { $regex: query, $options: 'i' } },
                                 { 'favoriteArtists.name': { $regex: query, $options: 'i' }  },
                                 { favoriteGenres: { $in: [query] } } ] } ).toArray((err, users)=>{
      console.log(users);
      fn(users);
    });
  }

  static findByEmail(email, fn){
    userCollection.findOne({'local.email': email}, (err, user)=>{
      fn(err, user);
    });
  }

}

function buildFriendArray(f, callback){
  console.log('IN THE ITERATOR');
  f = Mongo.ObjectID(f);
  userCollection.findOne({_id:f}, (err, obj)=>{
    showingFriends.push(obj);
    callback(null, obj);
  });
}


module.exports = User;
