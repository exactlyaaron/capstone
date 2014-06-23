// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'secrets', // your App ID
		'clientSecret' 	: 'secrets', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'secrets',
		'consumerSecret' 	: 'secrets',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	}

};
