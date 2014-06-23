/*jshint unused:false */
'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Post = traceur.require(__dirname + '/../models/post.js');


exports.index = (req, res)=>{
  Post.findPostsForDash(req.user._id, posts=>{
    console.log('====================');
    console.log('FOUND POSTS FOR DASH');
    console.log('====================');
    res.render('posts/list', {user: req.user, posts: posts, title: 'Posts'});
  });
};

exports.share = (req, res)=>{
  var user = req.user;
  user.sharePost(req.params.postId, ()=>{
    user.save(()=>{
      res.send('<p>SHARED DAT BITCH</p>');
    });
  });
};

exports.create = (req, res)=>{
  var obj = {};

  User.findById(req.user._id, (err, user)=>{
    obj.author = req.user._id;
    obj.authorName = user.appName;
    obj.authorPhoto = user.primaryPhoto;
    obj.body = req.body.post.body;
    obj.tags = req.body.post.tags.toLowerCase().split(',').filter(Boolean);

    var post = new Post(obj);
    post.save(()=>{
      var user = req.user;
      user.posts.push(post._id);
      user.save(()=>{
        res.render('posts/new', {post: post, title: 'New Post'});
      });
    });
  });
};
