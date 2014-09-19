/* jshint unused: false */
/* jshint quotmark: false */
// global functions
/* global ajax, getSuggestionNumber */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getTopTracks();
    $('#login-link').click(showLoginForm);
    $('#overlay').click(hideLoginForm);
    $('.boxclose').click(hideLoginForm);
  }

  function showLoginForm(){
    $('#login-modal').fadeIn();
    $('#overlay').fadeIn();
  }

  function hideLoginForm(){
    $('#login-modal').fadeOut();
    $('#overlay').fadeOut();
  }

  function getTopTracks(){
    var url = 'http://ws.audioscrobbler.com/2.0/?method=chart.gethypedtracks&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=5';

    $.getJSON(url, data=>{
      console.log(data.tracks.track);
      data.tracks.track.forEach(track=>{
        //console.log(track.image[1]);
        if(track.image){
          var obj = track.image[3];
          $('#top-albums').append(`<div class='top-album'><img src='${obj["#text"]}'></div>`);
        } else {
          $('#top-albums').append(`<div class='top-album'><img src='/img/assets/placeholder-album.jpg'></div>`);
        }
      });
    });
  }


})();
