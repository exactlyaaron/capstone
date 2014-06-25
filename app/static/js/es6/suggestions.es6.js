/* jshint unused: false */
/* global ajax, getSuggestionNumber, getSong */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('body').on('click', '#send-suggestion', sendSuggestion);
    $('body').on('click', '#delete-suggestion', deleteSuggestion);
    $('body').on('click', '#close-modal', closeModal);
    $('body').on('click', '#overlay', closeModal);
    $('body').on('click', '#selectall', checkBoxes);

    $('#results').on('click', '.suggest-music', showSuggestion);

    $('body').on('click', '.play-song', findSong);
  }

  function checkBoxes(){
    if(this.checked) { // check select status
        $('.friend-check').each(function() { //loop through each checkbox
            this.checked = true;  //select all checkboxes with class "checkbox1"
        });
    }else{
        $('.friend-check').each(function() { //loop through each checkbox
            this.checked = false; //deselect all checkboxes with class "checkbox1"
        });
    }
  }

  function deleteSuggestion(){
    var suggestionId = $(this).parent().attr('data-id');
    ajax(`/suggestions/${suggestionId}/destroy`, 'delete', null, html=>{
      $('#suggestions-all').empty().append(html);
      getSuggestionNumber();
    });
  }

  function showSuggestion(e){
    e.preventDefault();
    var userId = $('#user').attr('data-id');

    var suggestion = {};
    suggestion.musicType = $(this).closest('.search-result').attr('data-type');
    suggestion.mbid = $(this).closest('.search-result').attr('data-mbid');
    suggestion.name = $(this).siblings('.name').text();

    var photo = $(this).siblings('.photo').css('background-image');
    photo = photo.replace('url(','').replace(')','');
    suggestion.photo = photo;

    ajax(`/users/${userId}/suggest`, 'post', {suggestion: suggestion}, html=>{
      $('body').prepend(html);
    });
  }

  function sendSuggestion(){

    var friendsToSuggest = [];
    var friendsChecked = $('.friend-check:checked').toArray();

    friendsChecked.forEach(friend=>{
      var id = friend.defaultValue;
      friendsToSuggest.push(id);
    });

    if(friendsToSuggest.length === 0){
      alert('Please select at least one friend');
      return;
    }

    var userId = $('#user').attr('data-id');

    var suggestion = {};
    suggestion.musicType = $(this).siblings('#suggestion').attr('data-type');
    suggestion.mbid = $(this).siblings('#suggestion').attr('data-id');
    suggestion.name = $(this).siblings('#suggestion').find('.name').text();

    var photo = $(this).siblings('#suggestion').find('.photo').css('background-image');
    photo = photo.replace('url(','').replace(')','');
    suggestion.photo = photo;

    ajax(`/users/${userId}/suggest/${suggestion.mbid}`, 'post', {suggestion: suggestion, friends: friendsToSuggest}, html=>{
      $('#suggest-modal').empty().append(`<h2 class='sent'>SUGGESTION(S) SENT</h2>
                                          <button class='boxclose' id='close-modal'></button>`);
      console.log(html);
    });
  }

  function closeModal(){
    $('#overlay, #suggest-modal').remove();
  }

  function findSong(e){
    e.preventDefault();
    var id = $(this).attr('data-id');
    $(this).siblings('.photo').hide();

    var url = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=fe3c0d18e6dec590f61bf2a0f3615f2c&mbid='+id+'&format=json';

    $.getJSON(url, data=>{
      console.log(data);
      var song = data.track.name;
      var artist = data.track.artist.name;

      renderSong(song, artist, 175);
    });

  }

  function renderSong(song, artist, size){
    
    // var song = $(this).parent().attr('data-song');
    // var artist = 'artistName';
    //alert(artist);

    getSong(song, artist, size);
  }

})();
