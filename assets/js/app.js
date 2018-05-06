
$(document).ready(function () {
  $('#microphone').children().last().toggle();
  $('#camera').children().last().toggle();
  $('#phone').children().last().toggle();
  $('#record-icon').children().last().toggle();

  $("#chat").click(function () {
    $(".chat-panel").toggle();
    $(".notes-panel").hide();
    $(".alert-panel").hide();
  });
  $("#notes").click(function () {
    $(".notes-panel").toggle();
    $(".chat-panel").hide();
    $(".alert-panel").hide();
  });
  $("#alert-msg").click(function () {
    $(".alert-panel").toggle();
    $(".notes-panel").hide();
    $(".chat-panel").hide();
  });
  $(".user-img").click(function() {
      $(".profile-edit").toggle();
  });

  $('#logout').on('click',function(){
    console.log('logout')
    if(sessionStorage.getItem('bravUser')){
      var id = JSON.parse(sessionStorage.getItem('bravUser')).id;
      $.ajax({
        url: "/user/logout",
        method: "POST",
        data: {id:id},
        success: function(res){
          if(res.success){
            sessionStorage.removeItem('bravUser');
            window.location = '/';
          }
        },
        error: function(err){

        },
        dataType: 'JSON'
      });
    }else{
      window.location = '/';
    }
  });
  
  $('#mediator').on('click', function () {
    if (sessionStorage.getItem('bravUser')) {
      window.location = '/mediator/' + JSON.parse(sessionStorage.getItem('bravUser'))['id'];
    } else {
      window.location = '/';
    }
  })

});


function isValidEmail(email) {
  if (email && (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(email)) {
    return true;
  }
  return false;
}
