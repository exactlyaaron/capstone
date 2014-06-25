/* jshint unused: false */
/* global ajax */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('body').on('click', '.remove-artist', removeFavoriteArtist);
    $('#about, #favorite-music').hide();
    $('#show-about').click(showAbout);
    $('#show-posts').click(showPosts);
    $('#show-music').click(showMusic);
  }

  function showAbout(){
    $(this).addClass('active-tab');
    $('#show-posts').removeClass('active-tab');
    $('#show-music').removeClass('active-tab');

    $('#posts, #favorite-music').hide();
    $('#about').show();
  }

  function showPosts(){
    $(this).addClass('active-tab');
    $('#show-music').removeClass('active-tab');
    $('#show-about').removeClass('active-tab');

    $('#about, #favorite-music').hide();
    $('#posts').show();
  }

  function showMusic(){
    $(this).addClass('active-tab');
    $('#show-posts, #show-about').removeClass('active-tab');

    $('#posts, #about').hide();
    $('#favorite-music').show();
  }

  function removeFavoriteArtist(){
    var userId = $('#user').attr('data-id');
    var artistId = $(this).closest('.favorite-artist').attr('data-id');

    ajax(`/users/${userId}/removeArtist/${artistId}`, 'put', null, html=>{
      $('#favorite-artists').empty().append(html);
    });
  }

})();
