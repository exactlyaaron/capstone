var fbKey = process.env.FBKEY;
var fbSecret = process.env.FBSECRET;

var twitterKey = process.env.TWITTERKEY;
var twitterSecret = process.env.TWITTERSECRET;

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 	   	: fbKey, // your App ID
		'clientSecret' 	: fbSecret, // your App Secret
		'callbackURL' 	: 'http://fusion.aaronjohnsondesign.com/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: twitterKey,
		'consumerSecret' 	: twitterSecret,
		'callbackURL' 		: 'http://fusion.aaronjohnsondesign.com/auth/twitter/callback'
	}

};
