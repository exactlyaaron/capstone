(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#find-artists').click(searchArtists);
  }

  function searchArtists(){
    var query = $('#artist-search-input').val();
    console.log(query);

    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+query+'&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&format=json&limit=15';

    $.getJSON(url, data=>{
      //console.log(data);
      var foundArtists = data.results.artistmatches.artist;
      console.log(foundArtists);
      //$('#artist-results').append(`<div class="chartdiv" data-place=${place}>`);
    });
  }

})();
