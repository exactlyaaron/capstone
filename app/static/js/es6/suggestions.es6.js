/* jshint unused: false */
/* global ajax, getSuggestionNumber */

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

  function showSuggestion(){
    var userId = $('#user').attr('data-id');

    var suggestion = {};
    suggestion.musicType = $(this).closest('.search-result').attr('data-type');
    suggestion.mbid = $(this).closest('.search-result').attr('data-mbid');
    suggestion.name = $(this).siblings('.name').text();

    var photo = $(this).siblings('.photo').css('background-image');
    photo = photo.replace('url(','').replace(')','');
    suggestion.photo = photo;

    ajax(`/users/${userId}/suggest`, 'post', {suggestion: suggestion}, html=>{
      alert('got back');
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
      $('#suggest-modal').empty().append(`<h2>SUGGESTION(S) SENT</h2>`);
      console.log(html);
    });
  }

  function closeModal(){
    $('#overlay, #suggest-modal').remove();
  }

})();
