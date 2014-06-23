/* jshint unused: false */
/* global ajax */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('body').on('click', '.remove-artist', removeFavoriteArtist);
  }

  function removeFavoriteArtist(){
    var userId = $('#user').attr('data-id');
    var artistId = $(this).closest('.favorite-artist').attr('data-id');

    ajax(`/users/${userId}/removeArtist/${artistId}`, 'put', null, html=>{
      $('#favorite-artists').empty().append(html);
    });
  }

})();
