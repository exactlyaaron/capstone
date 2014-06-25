'use strict';

var _ = require('lodash');
var traceur = require('traceur');
var Message = traceur.require(__dirname + '/../models/message.js');
var User = traceur.require(__dirname + '/../models/user.js');

exports.index = (req, res)=>{
  Message.findAllByToId(req.user._id, messages=>{
    res.render('messages/index', {user: req.user, messages: messages, title: 'Inbox'});
  });
};

exports.new = (req, res)=>{
  User.findById(req.params.toId, (err, toUser)=>{
    res.render('messages/new', {user: req.user, toUser: toUser, toId: req.params.toId, title: 'Create New Message'});
  });
};

exports.create = (req, res)=>{
  Message.create(req.user._id, req.params.toId, req.body, message=>{
    console.log(message);
    res.redirect('/users/dash');
  });
};

exports.destroy = (req, res)=>{
  Message.findByMessageId(req.params.msgId, message=>{
    message = _.create(Message.prototype, message);
    message.destroy(()=>res.redirect('/messages/inbox'));
  });
};

exports.count = (req, res)=>{
  console.log('MESSSSAGES COUNTTTTT');
  Message.findAllByToId(req.user._id, messages=>{
    console.log('FOUND SOME MESSAGESSSSSSS');
    res.render('messages/count', {messages:messages, title:'Message Total'});
  });
};
