
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      var videoId;

      var startTime = 0;
      var endTime = 0;

      var currentTimeLeft = 0;
      var currentTimeRight = 0;

      var isVideoLoaded = false; //true if youtube video has been loaded

      var isScrolling = false; //used to prevent slider from snapping back and forth between old and new times

      $( "#timeSlider" ).slider({ //initializes the playback slider. The range of this slider is from the start time to the end time.
        step: .1,
        min: startTime,
        max: endTime,
        value: startTime,
        start: function( event, ui ) {startSliderChange(ui)},
        stop: function( event, ui ) {stopSliderChange(ui)}
        //slide: function( event, ui ) {slidingSliderChange(ui)}
      });
      var timeSliderVar;

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '621',
          playerVars: {
            'controls': '1',
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
        $("#loadVideoButton").removeAttr("disabled");
      }

      function onPlayerStateChange(event){
        if(event.data == YT.PlayerState.PLAYING){
          $(".ui-button-icon-primary", "#play").toggleClass("ui-icon-pause ui-icon-play");

          if(endTime == 0){
            endTime = player.getDuration();
            $( "#timeSlider" ).slider( "option", "max", endTime );
            startTimeSlider();
          }

          if(isScrolling){
            startTimeSlider();
            isScrolling = false;
          }
        }
        else if(event.data == YT.PlayerState.PAUSED){
          $(".ui-button-icon-primary", "#play").toggleClass("ui-icon-play ui-icon-pause");
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
		var math1 = Math.round(10 * (player.getCurrentTime() - startTime))/10;
        	$("#playTime").html(math1.toFixed(1) + " / " + (endTime - startTime).toFixed(1));
        }, 100);
      }

      function startSliderChange(ui){
        clearInterval(timeSliderVar);
        clearInterval(timeTextVar);
        isScrolling = true;
        timeTextVar = setInterval(function(){
          $("#playTime").html((Math.round(10 * ($( "#timeSlider" ).slider( "option", "value" ) - startTime))/10).toFixed(1) + "/" + (endTime - startTime));
        }, 100);
      }

      function stopSliderChange(ui){
        clearInterval(timeTextVar);
        player.seekTo(ui.value);
      }


      $(document).ready(function(){

        $("#loadVideoButton").on("click", function(event){
          event.preventDefault();

		  addBar();

          // regex to get video ID from a variety of YouTube URLs
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          var match = $("#videoURL").val().match(regExp);
          if (match&&match[2].length==11){
            videoId = match[2];
            isVideoLoaded = true;
          }
          else {
            alert("Not a valid YouTube URL.");
            return false;
          }

          player.loadVideoById(videoId, 0);
          $("#loadVideoButton").attr("disabled", "disabed");

          $("#chooseExampleButton").removeAttr("disabled");

          // endTime of 0 indicates video metadata not yet loaded. Metadata only loads when video starts playing
          endTime = 0;
        });

        $(function() {
            $("#play").button({
                icons: {
                    primary: "ui-icon-play"
                }
            })
        });

      });
