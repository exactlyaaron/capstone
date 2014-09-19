/* global ajax, getSong */
/* jshint unused:false */
/* jshint quotmark:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getArtistInfo();
    $('body').on('click', '.add-favorite-artist', addFavoriteArtist);
  }

  var artistName;
  //var songName;
  function getArtistInfo(){
    var mbid = $('#artist').attr('data-id');

    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid='+mbid+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=30';

    $.getJSON(url, data=>{
      var image = data.artist.image[4];
      artistName = data.artist.name;

      //$('#artist').append('<h2>APPENDDDD</h2>');
      $('#artist').append(`<div class='artist-pic photo' style='background-image:url("${image['#text']}")'></div>
                           <h2 class='artist-name'>${data.artist.name}</h2>
                           <a class='add-favorite-artist' href='#'>Add to Favorites</a>
                           <div class='clear'></div>
                           <p>${data.artist.bio.summary}</p>`);

      var tags = data.artist.tags.tag;
      tags.forEach(tag=>{
        $('#genres').append(`<p class='tag'>${tag.name}</p>`);
      });

      var url2 = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid='+mbid+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=5';

      $.getJSON(url2, data=>{

        var topTracks = data.toptracks.track;

        topTracks.forEach(song=>{

          var albumCover = song.image[3];
          $('#player').append(` <div data-song='${song.name}'>
                                  <div class='album-pic photo' style='background-image: url(${albumCover["#text"]})'></div>
                                  <p class='song-name'>${song.name}</p>
                                  <a class='play-song' href='#'><i class='fa fa-play-circle'></i> Play Song</a>
                                </div>
                                <div class='clear'></div>`);
        });


        $('body').on('click', '.play-song', renderSong);
      });
    });
  }

  function addFavoriteArtist(e){

    e.preventDefault();

    $(this).css('background-color', '#4B98C6');
    var userId = $('#user').attr('data-id');
    var artistId = $('#artist').attr('data-id');

    if(artistId === undefined){
      artistId = $(this).parent().attr('data-id');
    }

    var artistPhoto = $(this).siblings('.artist-pic').css('background-image').replace('url(','').replace(')','');
    //debugger;
    var artistName = $(this).prev().text();
    $(this).closest('.artist-result').addClass('favorited-artist');
    $(this).text('Added to Favorites');
    //alert(`${userId}, ${artistId}, ${artistName}`);

    ajax(`/users/${userId}/addArtist/${artistId}`, 'put', {artistName: artistName, artistPhoto: artistPhoto}, html=>{
      console.log(html);
    });
  }

  function renderSong(e){
    e.preventDefault();

    $(this).siblings('.photo').hide();

    var song = $(this).parent().attr('data-song');
    var artist = artistName;
    //alert(artist);

    getSong(song, artist);
  }

})();
