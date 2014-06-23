/*jshint unused:false */
'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Suggestion = traceur.require(__dirname + '/../models/suggestion.js');

exports.index = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! ROUTE SUGGESTIONS ALLLLL');
  Suggestion.findAllByToId(req.user._id, suggestions=>{
    res.render('suggestions/index', {user:req.user, suggestions:suggestions, title: 'Suggestions'});
  });
};

exports.destroy = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! ROUTE SUGGESTIONS DESTROY');
  Suggestion.destroy(req.params.id, ()=>{
    Suggestion.findAllByToId(req.user._id, suggestions=>{
      res.render('suggestions/list', {suggestions:suggestions, title: 'Suggestions'});
    });
  });
};

exports.showSuggestionBox = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!!  show SUGGESTION BOX');
  var user = req.user;
  user.findFriends(friends=>{
    console.log('FOUND FRIENDS');
    var suggestion = req.body.suggestion;
    res.render('suggestions/new', {user:req.user, friends:friends, suggestion:suggestion, title: 'Suggest Music'});
  });
};

exports.sendSuggestion = (req, res)=>{
  console.log('!!!!!!!!!!!!!!!!!!!!! ROUTE SEND SUGGESTION');
  var recipients = req.body.friends;
  recipients.forEach(rec=>{
    var obj = {};
    obj.fromId = req.user._id;
    obj.toId = rec;
    obj.mbid = req.body.suggestion.mbid;
    obj.musicType = req.body.suggestion.musicType;
    obj.photo = req.body.suggestion.photo;
    obj.name = req.body.suggestion.name;

    var suggestion = new Suggestion(obj);

    suggestion.save(()=>{
      console.log('suggestion saved======');
    });
  });

  res.send('you sent some suggestions');
};

exports.count = (req, res)=>{
  Suggestion.findAllByToId(req.user._id, suggestions=>{
    res.render('suggestions/count', {suggestions:suggestions, title:'suggestions Total'});
  });
};
