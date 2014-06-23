/* jshint unused:false */

var Mongo = require('mongodb');
var messageCollection = global.nss.db.collection('messages');
var userCollection = global.nss.db.collection('users');
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var _ = require('lodash');

class Message{
  static create(fromId, toId, body, fn){

    var message = new Message();
    message.fromId = Mongo.ObjectID(fromId);
    message.toId = Mongo.ObjectID(toId);
    message.message = body.message;

    messageCollection.save(message, ()=>fn(message));
  }

  static findByMessageId(messageId, fn){
    if(messageId.length !== 24){fn(null); return;}

    messageId = Mongo.ObjectID(messageId);
    messageCollection.findOne({_id:messageId}, (e,m)=>{
      if(m){
        m = _.create(Message.prototype, m);
        fn(m);
      }else{
        fn(null);
      }
    });
  }

  static findAllByToId(toId, fn){
    console.log('INSIDE THE INSTANCWEEEEEEE');
    console.log(toId);

    toId = Mongo.ObjectID(toId);

    messageCollection.find({toId:toId}).toArray((e,messages)=>{
      console.log('INSIDE THE FINDDDDD');

      if(messages){
        messages.forEach(m=>{

          console.log('DID I FIND A USER???????????');
          console.log(m);

          userCollection.findOne({_id: m.fromId}, (err, user)=>{

            m = _.create(Message.prototype, m);

            m.fromUserName = user.appName;
            m.fromUserPhoto = user.primaryPhoto;
            m.save(()=>{
              console.log('updated message');
            });
          });
        });

        fn(messages);

      } else {
        var array = [];
        fn(array);
      }

    });
  }

  save(fn){
    messageCollection.save(this, ()=>fn());
  }

  destroy(fn){
    messageCollection.remove({_id:this._id}, ()=>fn());
  }
}

module.exports = Message;
