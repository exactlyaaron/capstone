/* global ajax, getSong */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getArtistInfo();
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
      $('#artist').append(`<h2>${data.artist.name}</h2>
                           <img src='${image['#text']}'>
                           <p>${data.artist.bio.summary}</p>`);

      var tags = data.artist.tags.tag;
      tags.forEach(tag=>{
        $('#genres').append(`<p>${tag.name}</p>`);
      });

      var url2 = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid='+mbid+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=5';

      $.getJSON(url2, data=>{

        var topTracks = data.toptracks.track;

        topTracks.forEach(song=>{

          var albumCover = song.image[3];
          $('#player').append(` <div data-song='${song.name}'>
                                  <div class=album-pic style='background-image: url(${albumCover["#text"]})'></div>
                                  <p class='play-song'>${song.name}</p>
                                </div>`);
        });


        $('body').on('click', '.play-song', renderSong);
      });
    });
  }

  function renderSong(){
    var song = $(this).parent().attr('data-song');
    var artist = artistName;
    //alert(artist);

    getSong(song, artist);
  }

})();
