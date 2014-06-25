/* global io */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(initialize);

  var socket;

  function initialize(){
    initializeSocketIo();
    $('#send').click(send);

  }

  function send(){
    var message = $('#message').val();
    $('#message').val('');
    socket.emit('send-message', {message:message});
  }

  function initializeSocketIo(){
    socket = io.connect('/app');
    socket.on('online', online);
    socket.on('receive-message', receiveMessage);
  }

  function receiveMessage(data){
    var id = $('#user').attr('data-id');

    console.log('RECEIVE MESSAGE DAATA');
    console.log(data);
    var message;

    if(data.appName){
      message = `<div class='message-bubble bubble'>
                      <p class='from'>${data.appName} says:</p>
                      <p class='text'>${data.message}</p>
                     </div>`;
      if(data.id.toString() === id.toString()){
        message = `<div class='message-bubble bubble blue'>
                        <p class='from'>${data.appName} says:</p>
                        <p class='text'>${data.message}</p>
                       </div>`;
      }
    } else {
      message = `<div class='message-bubble bubble'>
                      <p class='from'>Guest says:</p>
                      <p class='text'>${data.message}</p>
                     </div>`;
    }
    $('#chat').prepend(message);
  }

  function online(data){
    console.log('INITIALIZEEEEEEEEEEEEEEEE');

    $('#users').empty();
    for (var user in data.users) {
      if( data.hasOwnProperty( user ) ) {
        $('#users').append(`<li class='numberUsers'>You have connected</li>`);
      }
    }
  }
})();
