function test_print(){
  console.log("test code")
}


$(function() {
   //GET all users and their info from tweetinfo
   $('#get-button').on('click', function() {
        $.ajax({
          url: '/tweets',
          contentType: 'application/json',
          success: function(response) {
            var tbodyEl = $('#namebody');
            tbodyEl.html('');
            response.tweetinfo.forEach(function(product){
              tbodyEl.append('\
              <tr>\
                  <td class = "id" >' + product.user.id + '</td>\
                  <td input type = "text" class = "name" value">' + product.user.screen_name + '</td>\
                  <td>' + product.user.name + '</td>\
              </tr>\
              ');
            })
          }
      });
    });

    //GET all tweet info from the tweetinfo array and display it
    $('#get-tweets-button').on('click', function(){
        $.ajax({
            url: '/tweetinfo',
            contentType: 'application/json',
            success: function(response) {
              var tbodyEl = $('#tweetbody');
              tbodyEl.html('');
              response.tweetinfo.forEach(function(product){
                tbodyEl.append('\
                 <tr>\
                    <td class = "id" >' + product.id + '</td>\
                    <td input type = "text" class = "name" value">' + product.text + '</td>\
                    <td>' + product.created_at + '</td>\
                 </tr>\
                ');
              })
            }
        });
    });

    //GET the one most recently searched tweet
    $('#searchsubmit').on('click', function(){
         $.ajax({
            url: '/searchinfo',
            contentType: 'application/json',
            success: function(response) {
              var tbodyEl = $('#searchbody');
              tbodyEl.html('');
                console.log(response.searchedObject);
                tbodyEl.append('\
                 <tr>\
                    <td class = "id" >' + response.searchedObject.id + '</td>\
                    <td input type = "text" class = "name" value">' + response.searchedObject.text + '</td>\
                    <td>' + response.searchedObject.created_at + '</td>\
                 </tr>\
                ');
            }
        });
    });

    //GET all recently searched tweets and display them
    $('#get-searched-tweets').on('click', function() {
        $.ajax({
            url: '/searchAll',
            contentType: 'application/json',
            success: function(response) {
              var tbodyEl = $('#searchbody');
              tbodyEl.html('');
              response.searchedArray.forEach(function(product){
                tbodyEl.append('\
                 <tr>\
                    <td class = "id" >' + product.id + '</td>\
                    <td input type = "text" class = "name" value">' + product.text + '</td>\
                    <td>' + product.created_at + '</td>\
                 </tr>\
                ');
              })
            }
        });
    });

  //CREATE/POST new tweets 
  $('#create-form').on('submit', function(event){
        event.preventDefault();
        var createInput = $('#create-input');

        $.ajax({
          url: '/tweetinfo',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({name: createInput.val() }),
          success: function(response) {
            console.log(response);
            createInput.val('');
            $('#get-tweets-button').click();
          }
        })
  });

  //CREATE/POST searched tweets
  $('#search-form').on('submit', function(event){
    event.preventDefault();
    var userID = $('#search-input');

        $.ajax({
          url: '/searchinfo',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({id:userID.val()}),
          success: function(response) {
            console.log(response);
            userID.val('');
          }
        })
  });

  //UPDATE/PUT
  $("#update-user").on('submit', function(event){
      event.preventDefault();
    var updateInput = $('#update-input');
    var inputString = updateInput.val();

    const parsedStrings = inputString.split(';');

    var name = parsedStrings[0];
    var newName = parsedStrings[1];

    $.ajax({
      url: '/tweets/' + name,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({nm:name, newName:newName}),
      success: function(response){
        console.log(response);
        $('#get-button').click();
      }
    });
  });

  //DELETE a tweet based on id
  $("#delete-form").on('submit', function() {
    var id = $('#delete-input').val()
   
      $.ajax({
        url: '/tweetinfo/'+id,
        method: 'DELETE',
        data:JSON.stringify({tweetid:id}),
        contentType: 'application/json',
        success: function(response){
          console.log(response);
          $('#get-tweets-button').click();
        }
      });
  });
}); 