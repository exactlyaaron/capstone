/* jshint unused: false */
/* global ajax */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getPosts();
    $('#new-post-submit').click(newPost);
    $('body').on('click', '.share-post', sharePost);
  }

  function sharePost(){
    var postId = $(this).closest('.post-wrapper').attr('data-id');

    ajax(`/posts/${postId}/share`, 'post', null, html=>{
      $(this).text('You shared that bitch');
    });
  }

  function newPost(){
    var userId = $('#user').attr('data-id');
    var post = {};
    post.body = $('#new-post-body').val();
    post.tags = $('#new-post-tags').val();

    ajax(`/posts/new`, 'post', {post:post}, html=>{
      $('#new-post-body').val('');
      $('#new-post-tags').val('');
      $('#posts').prepend(html);
    });
  }

  function getPosts(){
    var userId = $('#user').attr('data-id');

    ajax(`/posts/index`, 'get', null, html=>{
      $('#posts').empty().append(html);
    });
  }

})();
