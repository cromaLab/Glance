
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      //alert("Note: before submitting the HIT, you must view the video AND mark segments containing the action you are looking for!")

      // var startTime = 40; //start time. This is the only place the start time needs to be set.
      // var endTime = 90; //end time. This is the only place the end time needs to be set.

      var row; //JSON object containing setup info
      var startTime;
      var endTime;
      var vidId;

      var player;

      var debug = gup("debug"); //debug mode on (display real video times)? 


      //var vidId = 'M7lc1UVf-VE'; //youtube video ID

      $.ajax({
        dataType: "json",
        async: false,
        url: "php/getDBRow.php",
        data: {setupId: gup("setupId")}, //uses setupId to get correct row
        success: function(d) {
         row = d;
         startTime = parseFloat(row[0].start);
         endTime = parseFloat(row[0].end);
         vidId = row[0].videoId;
	 //alert("SUCCESS (yt.js) --> " + startTime + " | " + endTime + " | " + vidId)
        },
        fail: function(){
          alert("Failed to get row from db");
        }
      });

      //for testing
      if(gup("setupId") == "") {
 		alert("IN TESTING MODE");
        startTime = 10; //random example number
        endTime = 20; //random example number
        vidId = 'M7lc1UVf-VE'; // example videoId
      }


      var currentTimeLeft = 0;
      var currentTimeRight = 0;

      var isScrolling = false; //used to prevent slider from snapping back and forth between old and new times
      
      $( "#timeSlider" ).slider({ //initializes the playback slider. The range of this slider is from the start time to the end time.
        step: .1,
        min: startTime,
        max: endTime,
        value: startTime,
        start: function( event, ui ) {startSliderChange(ui)},
        stop: function( event, ui ) {stopSliderChange(ui)},
        slide: function( event, ui ) {slidingSliderChange(ui)}
      }); 
      var timeSliderVar;

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: vidId,
          playerVars: {
            'controls': '0',
            'start': startTime,
            'end': endTime,
            'showinfo': '0',
            'modestbranding': '1',
            'rel': '0'
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        //event.target.playVideo();
        startTimeSlider();
        // player.setPlaybackRate(2);
      }

      function onPlayerStateChange(event){
        // player.setPlaybackRate(2);
        // player.setPlaybackQuality("small");
        if(event.data == YT.PlayerState.PLAYING){
        	$("#but_swi").addClass("_pause").removeClass("_play");
			$("#but_swi").html("Pause");
         
        
          if(isScrolling){
            startTimeSlider();
            isScrolling = false;
          }
        }
        else if(event.data == YT.PlayerState.PAUSED){
            	$("#but_swi").addClass("_play").removeClass("_pause");
				$("#but_swi").html("Play");


        }
        else if(event.data == YT.PlayerState.ENDED){
          $("#legion-submit").removeAttr("DISABLED"); //enables submit button if video has ended
	  submittablePlayer = true;
        }
      }

      $("#play").on("click", function(event){ //controls the play/pause button
        if(player.getPlayerState() == 1){
          player.pauseVideo();
        }
        else{
          player.playVideo();
        }
      });


      var timeSliderVar;
      var timeTextVar;
      function startTimeSlider(){
        timeSliderVar = setInterval(function(){
          $( "#timeSlider" ).slider( "option", "value", player.getCurrentTime());
        }, 100);
        timeTextVar = setInterval(function(){
          if(debug){
            $("#playTime").html(player.getCurrentTime().toFixed(3));
          }
          else $("#playTime").html((Math.round(10 * (player.getCurrentTime() - startTime)) / 10).toFixed(1) + "/" + (endTime - startTime));
        }, 100);
      }

      function startSliderChange(ui){
        clearInterval(timeSliderVar);
        clearInterval(timeTextVar);
        isScrolling = true;
        timeTextVar = setInterval(function(){
          if(debug){
            $("#playTime").html(player.getCurrentTime().toFixed(3));
          }
          else $("#playTime").html((Math.round(10 * ($( "#timeSlider" ).slider( "option", "value" ) - startTime))/10).toFixed(1) + "/" + (endTime - startTime));
        }, 100);
      }

      function stopSliderChange(ui){
        clearInterval(timeTextVar);
        player.seekTo(ui.value);
      }

      function slidingSliderChange(ui){
         player.seekTo(ui.value);
      }

    $(document).ready(function(){
        setTimeout( function() { submittableTime = true; }, endTime - startTime );

      $('body').keypress(function(e){
         if(e.keyCode == 32){
             // user has pressed space
             // if(player.getPlayerState() == 1){//playing
             //    player.pauseVideo();
             //    window.clearInterval(autoMoveRight);
             // }
             // else{
             //    player.playVideo();
             //    if($('#toggleButton').data('state') == "setEnd"){
             //      autoMoveRight=setInterval(function(){//automatically moves the end piece
             //        $( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "values", 1, parseFloat((player.getCurrentTime() - startTime).toFixed(3)) );
             //      },100);
             //    }
             // }
             {$('#play').click(); 
             return false;}
         }
      });
    	

      $('#setEnd').on('click', function(){
        currentTimeRight = (player.getCurrentTime() - startTime).toFixed(3);
        currentTimeRight_float = parseFloat(currentTimeRight);//changes curr right to float
        var val_bar_r = $( "#slider-range" + activeBarID ).slider( "option" , "values");
        var set_left = val_bar_r[0];
        var set_right = val_bar_r[1];
        var set_right_float = parseFloat(set_right);
		$( "#slider-range" + activeBarID  ).slider( "values", 1, currentTimeRight );
		$( "#amount" + activeBarID ).val( val_bar_r[ 0 ] + "s - " + currentTimeRight_float +"s"); 
		val[(2 * activeBarID) + 1] = (val_bar_r[1] + startTime);

		    if( (set_left > currentTimeRight) ) //sets left marker to inital position if it adheres to one of two conditions: past the end marker on it's bar, or behind the end on the previos bar 
        	{
        		alert("You can't have the green slider (start) ahead of the red one(end)! [in the right]");
        		$( "#slider-range" + activeBarID ).slider( "values", 1, set_right );
        		val[(2 * activeBarID) + 1] = (set_right + startTime);
        		$( "#amount" + activeBarID ).val( val_bar_r[ 0 ] + "s - " + set_right_float +"s");
        	}
        	//alert(val.join('\n'));

	});

});
