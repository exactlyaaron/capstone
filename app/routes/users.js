'use strict';

// var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
//var userCollection = global.nss.db.collection('users');
var multiparty = require('multiparty');

// exports.lookup = (req, res, next)=>{
//   if(req.user){
//     console.log('************');
//     console.log(req.user);
//     console.log('************');
//     User.findById(req.user._id.toString(), user=>{
//       res.locals.user = user;
//       next();
//     });
//   }
//
//   next();
// };


exports.login = (req, res)=>{
  res.render('users/login', {title: 'LOGIN'});
};

exports.signup = (req, res)=>{
  res.render('users/signup', {title: 'SIGNUP'});
};

exports.dash = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! users dash');
  res.render('users/dashboard', {user: req.user, title: 'Dashboard'});
};

exports.profile = (req, res)=>{
  console.log('I AM HERE');
  console.log(req.user);
  res.render('users/profile', {user: req.user, title: 'PROFILE'});
};

exports.edit = (req, res)=>{
  res.render('users/edit', {user:req.user, title: 'Edit Profile'});
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

exports.logout = (req, res)=>{
  req.logout();
	res.redirect('/');
};
