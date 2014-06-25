// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '535516579885747', // your App ID
		'clientSecret' 	: '712ab5257cae81448c25a0594d8bf6fd', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '2c9x5DXPrGLNKl8a2tZ3Xx8IQ',
		'consumerSecret' 	: '5mDQopYOM98usBZKvB8dUk26krP2uChnOmyW5Ywj7RSyxOLN94',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	}

};
