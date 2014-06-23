/* jshint unused:false */

'use strict';

var userCollection = global.nss.db.collection('users');
var postCollection = global.nss.db.collection('posts');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var User = traceur.require(__dirname + '/user.js');
var _ = require('lodash');
var async = require('async');


var postsToShow;
var friendArray;
var friendPosts;
class Post {
  constructor(obj){
    this.author = obj.author;
    this.authorName = obj.authorName;
    this.authorPhoto = obj.authorPhoto;
    this.body = obj.body;

    obj.tags.map(tag=>{
      return tag.trim();
    });

    this.tags = obj.tags;
    this.date = new Date();

  }

  save(fn){
    postCollection.save(this, ()=>fn());
  }

  static findById(id, fn){
    Base.findById(id, postCollection, Post, fn);
  }

  static findPostsForDash(id, fn){
    postsToShow = [];
    friendArray = [];
    friendPosts = [];
    id = Mongo.ObjectID(id);
    User.findById(id, (err, user)=>{

      async.map(user.posts, buildPostArray, (err, resultsFirst)=>{
        console.log('FINISHED buildPostArray ASYNC MAP');
        console.log('RESULTS FIRST**************');

        async.map(user.friends, buildFriendArray, (err, resultsSecond)=>{
          console.log('FINISHED buildFriendArray ASYNC MAP');
          console.log('RESULTS SECOND**************');

          async.map(friendArray, buildFriendPostArray, (err, resultsThird)=>{
            console.log('FINISHED buildFriendPostArray ASYNC MAP');
            console.log('RESULTS THIRD**************');

            var flatArr = [].concat.apply([],resultsThird);
            console.log(flatArr);

            async.map(flatArr, finalizePostArray, (err, resultsFourth)=>{
              console.log('FINISHED finalizePostArray ASYNC MAP');
              console.log('RESULTS FOURTH**************');

              console.log('ASYNC DONE==============================================');

              postsToShow.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
              });

              fn(postsToShow);

            });

          });
        });
      });
    });
  }

}

function buildPostArray(p, callback){
  console.log('IN THE buildPostArray ITERATOR');
  p = Mongo.ObjectID(p);
  postCollection.findOne({_id:p}, (err, obj)=>{
    postsToShow.push(obj);
    callback(null, obj);
  });
}

function buildFriendArray(f, callback2){
  console.log('IN THE buildFriendArray ITERATOR');
  f = Mongo.ObjectID(f);
  userCollection.findOne({_id:f}, (err, obj)=>{
    friendArray.push(obj);
    callback2(null, obj);
  });
}

function buildFriendPostArray(friend, callback3){
  console.log('IN THE buildFriendPostArray ITERATOR');
  if(friend.posts.length > 0){
    var posts = friend.posts;
    friendPosts.push(posts);
    callback3(null, posts);
  } else {
    friendPosts.push(null);
    callback3(null, null);
  }
}

function finalizePostArray(p, callback4){
  console.log('IN THE finalizePostArray ITERATOR');

  if(typeof p === 'string'){
    if(p.length !== 24){callback4(null, null); return;}
    p = Mongo.ObjectID(p);
  }

  if(!(p instanceof Mongo.ObjectID)){callback4(null, null); return;}

  postCollection.findOne({_id:p}, (err, obj)=>{
    postsToShow.push(obj);
    callback4(null, obj);
  });
}


module.exports = Post;
