/* global ajax */
/* exported getSong */
/* jshint unused:false */

var songId;
var sizePx = 130;

function getSong(song, artist, size){
  'use strict';
  var track;

  songId = song;

  track = window.tomahkAPI.Track(song, artist, {
    width:100,
    height:100,
    disabledResolvers: [
        '',
        ''
        // options: 'SoundCloud', 'Officialfm', 'Lastfm', 'Jamendo', 'Youtube', 'Rdio', 'SpotifyMetadata', 'Deezer', 'Exfm'
    ],
    handlers: {
        onloaded: function() {
            //console.log(track.connection+':\n  api loaded');
        },
        onended: function() {
            //console.log(track.connection+':\n  Song ended: '+track.artist+' - '+track.title);
        },
        onplayable: function() {
            //console.log(track.connection+':\n  playable');
        },
        onresolved: function(resolver, result) {
            //console.log(track.connection+':\n  Track found: '+resolver+' - '+ result.track + ' by '+result.artist);
        },
        ontimeupdate: function(timeupdate) {
            var currentTime = timeupdate.currentTime;
            var duration = timeupdate.duration;
            currentTime = parseInt(currentTime);
            duration = parseInt(duration);

            //console.log(track.connection+':\n  Time update: '+currentTime + ' '+duration);
        }
    }
  });

  renderTrack(song, artist, size);
  //document.getElementById('controls').style.display = 'block';
}


var playerEl;
var track;
function renderTrack(song, songArtist, size) {
  'use strict';
  playerEl = $(`div[data-song='${songId}']`);

  if(size){
    sizePx = size;
  }

  var title = song;
  var artist = songArtist;
  var width = sizePx;
  var height = sizePx;

  //var disabled0 = document.getElementById('disabledResolvers0').value;
  //var disabled1 = document.getElementById('disabledResolvers1').value;

  //playerEl.innerHTML = '';


  track = window.tomahkAPI.Track(title,artist, {
    width:width,
    height:height,
    //disabledResolvers: [ disabled0, disabled1 ],
    handlers: {
      onloaded: function() {
          //console.log(track.connection+':\n  api loaded');
      },
      onended: function() {
          //console.log(track.connection+':\n  Song ended: '+track.artist+' - '+track.title);
      },
      onplayable: function() {
          //console.log(track.connection+':\n  playable');
      },
      onresolved: function(resolver, result) {
          //console.log(track.connection+':\n  Track found: <b>'+resolver+'</b> - '+ result.track + ' by '+result.artist);
      },
      ontimeupdate: function(timeupdate) {
          var currentTime = timeupdate.currentTime;
          var duration = timeupdate.duration;
          currentTime = parseInt(currentTime);
          duration = parseInt(duration);

          //console.log(track.connection+':\n  Time update: '+currentTime + ' '+duration);
      }
    }
  });

  playerEl.prepend(track.render());
  //$('#player').append(`<p style='display:inline-block'></p>`);
}
