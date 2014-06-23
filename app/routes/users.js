'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
//var userCollection = global.nss.db.collection('users');
var multiparty = require('multiparty');
//
// exports.lookup = (req, res, next)=>{
//   if(!res.locals.user){
//     if(req.user){
//       User.findById(req.user._id, (err, user)=>{
//         res.locals.user = user;
//         next();
//       });
//     } else {
//       res.redirect('/');
//       next();
//     }
//   } else {
//     next();
//   }
// };

exports.login = (req, res)=>{
  res.render('users/login', {user: req.user, title: 'LOGIN'});
};

exports.signup = (req, res)=>{
  res.render('users/signup', {title: 'SIGNUP'});
};

exports.dash = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! users dash');
  res.render('users/dashboard', {user: req.user, title: 'Dashboard'});
};

exports.showFriends = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! users show friends');
  var user = req.user;
  user.findFriends(friends=>{
    console.log('FOUND SOME FREINDS');
    console.log(friends);
    res.render('users/friends', {user: req.user, friends:friends, title: 'Friends List'});
  });
};

exports.profile = (req, res)=>{
  res.render('users/profile', {user: req.user, title: 'PROFILE'});
};

exports.showProfile = (req, res)=>{
  console.log('MADE IT TO THE SHOW PROFILE ROUTE');
  User.findById(req.params.userId, (err, otherUser)=>{
    var user = req.user;
    user.isFriend(otherUser._id, friend=>{
      console.log('========');
      console.log(friend);
      res.render('users/other-profile', {user: req.user, otherUser: otherUser, friend: friend, title: 'User Profile'});
    });
  });
};


exports.edit = (req, res)=>{
  res.render('users/edit', {user: req.user, title: 'Edit Profile'});
};

exports.update = (req, res)=>{
  var form = new multiparty.Form();
  var user = req.user;

  form.parse(req, (err, fields, files)=>{
    user.update(fields, files);
      user.save(()=>{
        res.redirect('/users/dash');
      });
    });
};

exports.search = (req, res)=>{
  console.log('MADE IT TO THE ROUTE');
  User.searchUsers(req.body.query, users=>{
    res.render('users/search', {user: req.user, title: 'Search Results', users:users, query: req.body.query});
  });
};

exports.showAll = (req, res)=>{
  console.log('MADE IT TO THE ROUTE - SHOW ALL');
  User.findAllOthers(req.user, users=>{
    res.render('users/discover', {user: req.user, title: 'Discover', users:users});
  });
};

exports.searchUsers = (req, res)=>{
  console.log('MADE IT TO THE ROUTE - SEARCH USERS');
  User.searchUsers(req.query.query, users=>{
    res.render('users/results-users', {user: req.user, title: `Search: ${req.query.query}`, users:users});
  });
};

exports.addFriend = (req, res)=>{
  var user = req.user;
  user.addFriend(req.params.otherId, ()=>{
    user.save(()=>{
      res.send('Added a Friend');
    });
  });
};

exports.removeFriend = (req, res)=>{
  var user = req.user;
  user.removeFriend(req.params.otherId, ()=>{
    user.save(()=>{
      res.send('REMOVED a Friend');
    });
  });
};

exports.logout = (req, res)=>{
  req.logout();
	res.redirect('/');
};
