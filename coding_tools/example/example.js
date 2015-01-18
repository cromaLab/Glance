$(document).ready(function(){
  
  if(gup("mode") == "rabbit"){
    var url = "../singleButton.php";
  }
  else{
    var url = "../index.html";
  }
  url += "?setupId=" + gup("setupId");
  url += "&turkSubmitTo=" + gup("turkSubmitTo");
  url += "&workerId=" + gup("workerId");
  url += "&assignmentId=" + gup("assignmentId");
  url += "&hitId=" + gup("hitId");
  url += "&mode=" + gup("mode");
  url += "&lineup=" + gup("lineup");

  $.ajax({
    dataType: "json",
    async: false,
    url: "getDBRow.php",
    data: {setupId: gup("setupId")},
    success: function(d) {
     row = d;

  //alert("SUCCESS (yt.js) --> " + startTime + " | " + endTime + " | " + vidId)
    },
    fail: function(){
      alert("Failed to get row from db");
    }
  });

  $("#continue").on("click", function(event){
    event.preventDefault();
    window.location = url;
  });

  $("#action").html(row[0].action);
  $("#description").html(row[0].description);

  //if there is no example clip to show, hide the video div and enable continue button
  if(row[0].clipEnd == 0) {
    $("#clip").hide();
    $("#continue").removeAttr("DISABLED"); //enables continue button if video has ended
    $("#continue").attr("value", "Continue"); //enables continue button if video has ended
  }

  $( "#timeSlider" ).slider( "option", "max", endTime );
  $( "#timeSlider" ).slider( "option", "min", startTime );
  $( "#timeSlider" ).slider( "option", "value", startTime );


});

// // //gets row from relevant session in db
// // var row;
// // $.ajax({
// //   dataType: "json",
// //   async: false,
// //   url: "getDBRow.php",
// //   data: {session: gup("session")},
// //   success: function(d) {
// //     row = d;
// //   },
// //   fail: function(){
// //     alert("Failed to get row from db");
// //   }
// // });

// if(row[0].clipEnd > 0)
// {
//   // these vars are used in youtube.js
//   var startTime = row[0].clipStart;
//   var endTime = row[0].clipEnd;
//   var vidId = row[0].videoId;

// }