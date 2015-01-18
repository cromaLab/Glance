
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      // var startTime = 40; //start time. This is the only place the start time needs to be set.
      // var endTime = 90; //end time. This is the only place the end time needs to be set.

      var row; //JSON object containing setup info
      var startTime;
      var endTime;
      var vidId;

      //var vidId = 'M7lc1UVf-VE'; //youtube video ID

      $.ajax({
        dataType: "json",
        async: false,
        url: "getDBRow.php",
        data: {setupId: gup("setupId")},
        success: function(d) {
         row = d;
         startTime = parseFloat(row[0].clipStart);
         endTime = parseFloat(row[0].clipEnd);
         vidId = row[0].videoId;
	       // alert("SUCCESS (yt.js) --> " + startTime + " | " + endTime + " | " + vidId);
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
        min: startTime.toFixed(2),
        max: endTime.toFixed(2),
        value: startTime.toFixed(2),
        start: function( event, ui ) {startSliderChange(ui)},
        stop: function( event, ui ) {stopSliderChange(ui)}
        //slide: function( event, ui ) {slidingSliderChange(ui)}
      }); 
      var timeSliderVar;

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      // alert(endTime);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: vidId,
          playerVars: {
            'controls': '0',
            'start': startTime.toFixed(0),
            'end': endTime.toFixed(0),
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
        // player.seekTo(startTime);

        //TEMP
        $("#continue").removeAttr("DISABLED"); //enables submit button if video has ended
        $("#continue").val("Continue"); //enables submit button if video has ended

      }

      function onPlayerStateChange(event){
        if(event.data == YT.PlayerState.PLAYING){
          $("#play").html("Pause");
          if(isScrolling){
            startTimeSlider();
            isScrolling = false;
          }
        }
        else if(event.data == YT.PlayerState.PAUSED){
          $("#play").html("Play");
        }
        else if(event.data == YT.PlayerState.ENDED){
          $("#continue").removeAttr("DISABLED"); //enables submit button if video has ended
          $("#continue").val("Continue"); //enables submit button if video has ended
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
          $("#playTime").html((Math.round(10 * (player.getCurrentTime() - startTime)) / 10).toFixed(1) + "/" + (endTime - startTime).toFixed(2));
        }, 100);
      }

      function startSliderChange(ui){
        clearInterval(timeSliderVar);
        clearInterval(timeTextVar);
        isScrolling = true;
        timeTextVar = setInterval(function(){
          $("#playTime").html((Math.round(10 * ($( "#timeSlider" ).slider( "option", "value" ) - startTime))/10).toFixed(1) + "/" + (endTime - startTime).toFixed(2));
        }, 100);
      }

      function stopSliderChange(ui){
        clearInterval(timeTextVar);
        player.seekTo(ui.value);
      }

      // function slidingSliderChange(ui){
      //   player.seekTo(ui.value, false);
      // }

    $(document).ready(function(){
     //  player.seekTo(startTime + .01);
    	// var hackyVideoNotStoppingFix = setInterval(function(){
     //    if(player.getCurrentTime() > endTime){
     //      player.pauseVideo();
     //    }
     //  }, 100);
    });
