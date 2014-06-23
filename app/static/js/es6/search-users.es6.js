/* global ajax, getSong */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#search-users').click(searchUsers);
  }

  function searchUsers(){
    var query = $('#search-users-input').val();

    ajax('/search/users', 'get', {query:query}, html=>{
      $('#results-users').empty().append(`<p>Results for: "${query}"</p>`);
      $('#results-users').append(html);
    });
  }

})();
