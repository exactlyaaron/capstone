'use strict';
// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;


// load up the user model\
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var userCollection = global.nss.db.collection('users');
var _ = require('lodash');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
      console.log('Serialize: ' + user);
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user){
          console.log('Deserialize: ' + user);
          if(!err){
            done(null, user);
          } else {
            done(err, null);
          }
      });
    });

  	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {

        req.flash('signupMessage', '');

        if(!req.user){
          process.nextTick(function() {

            userCollection.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err){
                  return done(err);
                }

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                  var newUser = new User();

                  newUser.local.email    = email;
                  newUser.local.password = newUser.generateHash(password);

                  newUser.save(function(err) {
                      if (err){
                        throw err;
                      }
                      return done(null, newUser);
                  });
                }

            });

          });
        } else {
          process.nextTick(function(){

            User.findByEmail(email, function(err, user) {

              if(err){
                return done(err);
              }

              if(user){
                return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
              } else {

                var existingUser = req.user; // pull the user out of the session

                existingUser = _.create(User.prototype, existingUser);

                existingUser.local.email = email;
                existingUser.local.password = existingUser.generateHash(password);

                existingUser.save(function(err){
                  if(err){
                    throw err;
                  }
                  return done(null, existingUser);
                });
              }
            });
          });
        }


    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      userCollection.findOne({ 'local.email' :  email }, function(err, user) {

          user = _.create(User.prototype, user);

          if (err){
            return done(err);
          }

          if (!user){
            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
          }

          if (!user.validPassword(password)){
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
          }

          return done(null, user);
      });

    }));


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

      clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {

        	if (!req.user) {

            // find the user in the database based on their facebook id
            userCollection.findOne({ 'facebook.id' : profile.id }, function(err, user) {

              if (err){
                return done(err);
              }

              if (user) {
                  return done(null, user);
              } else {

                var newUser = new User();

                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save(function(err) {
                  if (err){
                    throw err;
                  }

                  return done(null, newUser);
                });
              }

            });

	        } else {
            var user = req.user;
            user = _.create(User.prototype, user);

            user.facebook.id    = profile.id;
            user.facebook.token = token;
            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value;

            user.save(function(err) {
                if (err){
                  throw err;
                }

                return done(null, user);
            });
	        }

        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true

    },

    function(req, token, refreshToken, profile, done) {

          	process.nextTick(function() {

              if (!req.user) {

                userCollection.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                  if (err){
                    return done(err);
                  }

                  if (user) {
                      return done(null, user); // user found, return that user
                  } else {
                    var newUser                 = new User();

                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function(err) {
                        if (err){
                          throw err;
                        }

                        return done(null, newUser);
                    });
                  }
                });

              }else{
                var user = req.user;
                user = _.create(User.prototype, user);

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err){
                      throw err;
                    }

                    return done(null, user);
                });
              }

      	});

    }));


};
