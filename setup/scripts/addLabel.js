var sessions = new Array();
var numButtonsOnPage = 0;
var sessionName;

$(document).ready(function(){
  $("#cancelQueryButton").on("click", function(event){
    deactivateRouterSession(getSession());
  });

    $("#labelControls *").disable(); //initially disable the controls div
	 
    var barWasAdded = false;//true when the bar is added
    var submittedOnce = false;

    $('#options').hide();//hides options by default

	//submits label request
    $("#getLabelsButton").on("click", function(event){

    event.preventDefault();


	//gets session from URL param or auto generates it. Session should be unique for each specific labeling request.
	if($("#sessionOverride").val() != ""){
    var session = $("#sessionOverride").val();
  }
  else if(gup("session") != "") {
		var session = gup("session") + $("#action").val();
	}
	else {
		// var session = $("#trialInput").val() + $("#action").val();
    alert("need a session (maybe use url param");
	}

      //adds new button
      // var color = getRandomColor();
      // $("#tabs").append("<button style = 'background:" + color + " !important;' id = 'sessionButton" + numButtonsOnPage + "'class='pure-button sessionButton' onclick='sessionButtonClick(" + numButtonsOnPage + ")'/>" + $("#action").val() + " <input class = 'sessionCheckbox' id='showSession" + numButtonsOnPage + "' type='checkbox'/></button></br>"); 

        var mturk = $('#mturkSelect').val();//stores if session using mturk/sandbox/live
        var clipLength = $('#clipLength').val();//stores length of the clip for session
        var initialStartTime = $( "#startTimeField" ).val();//stores initial start time of session video
        var initialEndTime = $( "#endTimeField" ).val();//stores initial end time of session video

	// WSL: TODO: Use this again when using sliders
        //var clipStartingTime = $( "#slider-range0" ).slider( "values", 0 ); //detemines start time of example clip
        //var clipEndingTime = $( "#slider-range0" ).slider( "values", 1 ); //determines start time of example clip
        // var clipStartingTime = startTimeField;
        // var clipEndingTime = endTimeField;


        //post initial row to db
        $.ajax({
            type: "POST",
            async: false,
            url: "php/addDbRow.php",
            data: {session: session, start: initialStartTime, end: initialEndTime, clipStart: clipStartingTime, clipEnd: clipEndingTime, videoId: videoId, action: $("#action").val(), description: $("#description").val(), trial: "", clipIndex: -1, mturk: mturk, clipLength: clipLength, initialStart: initialStartTime, initialEnd: initialEndTime},
            success: function() {
              //alert("added initial row to db");
            },
            fail: function(){
              alert("Failed to add row to db");
            }
        });


console.log("FALLLLLLLLLLING")
        sessions[numButtonsOnPage] = session; //logs session in array in order of appearance on the page

        postClips($('#sampleSelect').val(), session, $('#depthSelect').val()); //finds and posts the clips

        //resets entry fields
console.log("LANDED")
        $('#slider-container').empty(); //remove bar
        // $("#action").val("");
        // $("#description").val("");
        // $("#startTimeField").val("");
        // $("#endTimeField").val("");

        barWasAdded = false;
        numButtonsOnPage++;

        var count = addBar();
        $("#" + count + "_text").val(session);


    });

    //shows range slider if video has been loaded and user clicks on label adding div
	
    $("#addLabels").on("click", function(event){
        //don't do anything if the "get labels" button was clicked
        if($(event.target).is('#getLabelsButton')){
						
        }else if($(event.target).is('#showOptions')){
		
          	event.preventDefault();
          	$('#options').slideToggle();
		  	return true;
			
        }
		
		isVideoLoaded = true;
		
        if(isVideoLoaded == true){
            if(!barWasAdded){
                barWasAdded = true;
                $("#getLabelsButton").removeAttr("disabled");
            }
        }
        else{
			
            barWasAdded = false;
            alert("You must load a video before you can add labels.");
			
        } 

        // $('#showOptions').on('click', function(event){
        //   event.preventDefault();
        //   $('#options').slideToggle();
        // });
    });
	
	
    
  //  $('#t').focusout(function() {
  // 		   		var time_entry = $("#t").val();

		// if(/^[a-zA-Z0-9- ]*$/.test(time_entry) == false) {
  //  			alert('Your search string contains illegal characters.');
		// }

   		
  //  		if(time_entry.indexOf("\:") !==  -1 ){ //checks if colon was entered
  //  			var str_seconds = time_entry.slice(-2); //gets seconds from string
  //  			if(isNaN(str_seconds) == true){ //checks if econds are a number
  //  				alert('not a number');
  //  				$('#t').focusin();
  //  				$('#t').val('');
  //  			}
  //  			var time_arr = time_entry.split('');
  //  			var colon_position = time_entry.indexOf("\:"); //finds position of colon
  //  			var j = 0;
  //  			for( var i = 0; i < colon_position; i++)
  //  			{
  //  				j++; // to create substring for any length of minutes
  //  			}
  //  			var mins = time_entry.substring(0,j); //the minutes
  //  			if(isNaN(mins) == true){ //checks if mins is number
  //  				alert('not a number');
  //  				$('#t').focusin();
  //  				$('#t').val('');
  //  			}
  //  		}
   	// }); 

});

function deactivateRouterSession(sessionNum){
    if(confirm("Deactivate session '" + getSession() + "'' in router?")){
      // var sessionName = sessions[sessionNum];
      var sessionName = sessionNum;
      $.ajax({
          type: "POST",
          async: false,
          url: "../workrouter/deactivateSession.php",
          data: {session: sessionName},
          success: function() {
            alert(getSession() + " deactivated");
          },
          fail: function(){
            alert("Failed to cancel session in router.");
          }
      });
    }
}

function raiseSamplingPercent(sessionNum){
  var sessionName = sessions[sessionNum];
  postClips($('#sampleSelectRaise').val(), sessionName, $('#sampleDepth').val());
}

function getRandomColor () {
  var hex = Math.floor(Math.random() * 0xFFFFFF);
  return "#" + ("000000" + hex.toString(16)).substr(-6);
}

function sessionButtonClick(buttonNum){

  // If button is already active, deactivate it
  if($( "#sessionButton" + buttonNum ).hasClass( "pure-button-active" )) {
    $( "#sessionButton" + buttonNum ).removeClass( "pure-button-active buttonIsActive" );
    $("#labelControls *").disable(); //initially disable the controls div
  }
  
  // If the button isnt active yet
  else{

    // deactivate all the buttons
    for(var i = 0; i <= numButtonsOnPage; i++ ){
      $( "#sessionButton" + i ).removeClass( "pure-button-active buttonIsActive" );
    }

    // activate the correct button
    $( "#sessionButton" + buttonNum ).addClass( "pure-button-active buttonIsActive" );

    // checkIfCanEnableRaiseControl(buttonNum);

    // $("#cancelQueryButton").enable();

    // $("#cancelQueryButton").unbind("click"); //get rid of old onclick
    // $("#raiseSampleButton").unbind("click");

    // $("#cancelQueryButton").on("click", function(event){
    //   event.preventDefault();
    //   deactivateRouterSession(buttonNum)
    // });

    $("#raiseSampleButton").on("click", function(event){
      event.preventDefault();
      raiseSamplingPercent(buttonNum)
    });

    loadIframe("vis_tool_iframe", "http://roc.cs.rochester.edu/convInterface/videocoding/tools/vis_tools/?session=" + sessions[buttonNum] + "&amp;details=true&embedded=true");

  }
}

$.fn.disable = function() {
    return this.each(function() {
        if (typeof this.disabled != "undefined") this.disabled = true;
    });
}

$.fn.enable = function() {
    return this.each(function() {
        if (typeof this.disabled != "undefined") this.disabled = false;
    });
}

function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ( $iframe.length ) {
        $iframe.attr('src',url);   
        return false;
    }
    return true;
}

function getSession(){
  if($("#sessionOverride").val() != ""){
      return $("#sessionOverride").val();
    }
    else if(gup("session") != "") {
      return gup("session") + $("#action").val();
    }
    else alert("need a session");
}
