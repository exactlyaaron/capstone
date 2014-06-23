'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

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
  var artists = traceur.require(__dirname + '/../routes/artists.js');
  var suggestions = traceur.require(__dirname + '/../routes/suggestions.js');
  var messages = traceur.require(__dirname + '/../routes/messages.js');
  var posts = traceur.require(__dirname + '/../routes/posts.js');
  var User = traceur.require(__dirname + '/../models/user.js');
  var _ = require('lodash');
  var passport = require('passport');
  require('../config/passport')(passport); // pass passport for configuration

  //app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.get('/login', dbg, users.login);
  app.get('/signup', dbg, users.signup);
  app.get('/profile', dbg, isLoggedIn, users.profile);
  app.get('/logout', dbg, users.logout);

  app.get('/users/edit',dbg, users.edit);
  app.post('/users/edit',dbg, users.update);
  app.get('/users/dash', dbg, users.dash);
  app.get('/users/friends', dbg, users.showFriends);

  app.get('/users/all', dbg, users.showAll);
  app.get('/users/profile/:userId', dbg, users.showProfile);

  app.post('/search', dbg, users.search);
  app.get('/search/users', dbg, users.searchUsers);

  app.put('/users/:userId/addArtist/:artistId', dbg, artists.addArtist);
  app.put('/users/:userId/removeArtist/:artistId', dbg, artists.removeArtist);

  app.put('/users/:userId/addFriend/:otherId', dbg, users.addFriend);
  app.put('/users/:userId/removeFriend/:otherId', dbg, users.removeFriend);

  app.post('/users/:userId/suggest', dbg, suggestions.showSuggestionBox);
  app.post('/users/:userId/suggest/:mbid', dbg, suggestions.sendSuggestion);

  app.get('/suggestions/all', dbg, suggestions.index);
  app.get('/suggestions/:toId/count', dbg, suggestions.count);

  app.delete('/suggestions/:id/destroy', dbg, suggestions.destroy);

  app.get('/posts/index', dbg, posts.index);
  app.post('/posts/new', dbg, posts.create);
  app.post('/posts/:postId/share', dbg, posts.share);

  app.get('/artists/:artistId', dbg, artists.show);

  app.get('/messages/inbox', dbg, messages.index);
  app.post('/messages/:msgId', dbg, messages.destroy);
  app.get('/messages/new/:toId', dbg, messages.new);
  app.post('/messages/new/:toId', dbg, messages.create);
  app.get('/messages/:toId/count', dbg, messages.count);

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

  // =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

  // =====================================
	// TWITTER ROUTES ======================
	// =====================================
	// route for twitter authentication and login
	app.get('/auth/twitter', passport.authenticate('twitter'));

	// handle the callback after twitter has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('users/connect-local', { message: req.flash('registerMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user = _.create(User.prototype, user);
        user.facebook.token = undefined;
        user.facebook.name = undefined;
        user.facebook.email = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user = _.create(User.prototype, user);
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

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
