'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

// var passport = require('passport');
// require('./models/passport')(passport); // pass passport for configuration


module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var passport = require('passport');
  require('../config/passport')(passport); // pass passport for configuration

  app.get('/', dbg, home.index);

  app.get('/login', dbg, users.login);
  app.get('/signup', dbg, users.signup);
  app.get('/profile', dbg, isLoggedIn, users.profile);
  app.get('/logout', dbg, users.logout);

  app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

  app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

  // process the login form
	// app.post('/login', do all our passport stuff here);



  console.log('Routes Loaded');
  fn();
}

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}
