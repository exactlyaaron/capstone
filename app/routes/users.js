'use strict';

exports.login = (req, res)=>{
  res.render('users/login', {title: 'LOGIN'});
};

exports.signup = (req, res)=>{
  res.render('users/signup', {title: 'SIGNUP'});
};

exports.profile = (req, res)=>{
  console.log('****************');
  console.log(req.user);
  res.render('users/profile', {user: req.user, title: 'PROFILE'});
};

exports.logout = (req, res)=>{
  req.logout();
	res.redirect('/');
};
