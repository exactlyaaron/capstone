/* jshint unused: false */
// global functions
/* exported ajax, getSuggestionNumber */

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}

function getSuggestionNumber(){
  'use strict';

  ajax(`/suggestions/:toId/count`, 'get', null, html=>{
    $('p.suggestion-count').remove();
    $('#suggestions-nav').append(html);
  });
}

function getMessageNumber(){
  'use strict';

  ajax(`/messages/:toId/count`, 'get', null, html=>{
    $('p.message-count').remove();
    $('#messages-nav').append(html);
  });
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getSuggestionNumber();
    getMessageNumber();
  }


})();
