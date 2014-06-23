/* jshint unused: false */
/* global ajax */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('body').on('click', '#add-friend', addFriend);
    $('body').on('click', '#remove-friend', removeFriend);
  }

  function addFriend(){
    var userId = $('#user').attr('data-id');
    var otherId = $('#other-user').attr('data-id');

    ajax(`/users/${userId}/addFriend/${otherId}`, 'put', null, html=>{
      $('#add-friend').text('ADDED TO FRIENDS');
    });
  }

  function removeFriend(){
    var userId = $('#user').attr('data-id');
    var otherId = $('#other-user').attr('data-id');

    ajax(`/users/${userId}/removeFriend/${otherId}`, 'put', null, html=>{
      $('#remove-friend').text('UNFRIENDED!!!');
    });
  }

})();
