/* global ajax, getSong */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    searchArtists();
    $('body').on('click', '.add-favorite-artist', addFavoriteArtist);
  }

  var artistName;

  function searchArtists(){
    var query = $('#query').text();
    console.log(query);

    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+query+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=30';

    $.getJSON(url, data=>{
      //console.log(data);
      var foundArtists = data.results.artistmatches.artist;
      foundArtists.forEach(artist=>{
        var obj = artist.image[4];
        var picture = obj['#text'];
        //<img src=${obj['#text']}>
        if(picture === ''){
          picture = '/img/assets/placeholder.jpg';
        }

        if(artist.mbid){
          $('#artists').append(`<div class='artist-result search-result' data-type='artist' data-mbid='${artist.mbid}'>
                                  <div class='artist-pic photo' style='background-image:url("${picture}")'></div>
                                  <a href='/artists/${artist.mbid}' class='artist-name name'>${artist.name}</p>
                                  <a class='add-favorite-artist'>Add to Favorites</a>
                                  <a href='#' class='suggest-music'>Recommend</a>
                                </div>`);
        }
      });

      var url2 = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+query+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=30';

      $.getJSON(url2, data=>{
        console.log(data);
        var foundSongs = data.results.trackmatches.track;
        foundSongs.forEach(song=>{
          var albumCover;
          if(song.image){
            if(song.image.length > 3){
              albumCover = song.image[3];
            }
          } else {
            albumCover = '/img/assets/placeholder.jpg';
          }
          var songName = song.name;
          var songArtist = song.artist;

          $('#player').append(` <div class='search-result' data-type='song' data-song='${songName}' data-artist='${songArtist}' data-mbid='${song.mbid}'>
                                  <div class='album-pic photo' style='background-image: url(${albumCover["#text"]})'></div>
                                  <h3 class='play-song name'>${song.name}</h3>
                                  <p>Artist: ${songArtist}</p>
                                  <a href='#' class='suggest-music'>Recommend</a>
                                </div>`);
        });

        $('body').on('click', '.play-song', renderSong);
      });
    });
  }

  function renderSong(){
    var song = $(this).parent().attr('data-song');
    var artist = $(this).parent().attr('data-artist');
    //alert(artist);

    getSong(song, artist);
  }

  function addFavoriteArtist(){
    var userId = $('#user').attr('data-id');
    var artistId = $(this).closest('.artist-result').attr('data-mbid');
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

})();
