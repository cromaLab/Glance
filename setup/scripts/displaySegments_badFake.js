var getSegmentsInterval;

var tabClicked = function(event){	

	window.clearInterval(getSegmentsInterval); //clear interval from other sessions
	$('#segments').empty(); //clear any segments marked from other sessions

	var index = $( "#tabs" ).tabs( "option", "active" ); //index of tab clicked
	var session = sessions[index]; //gets session from array of session names
	var segments = new Array();

	var randomInterval;

	getSegmentsInterval = setInterval(function(){

		var sessName;
		// alert('index:' + index);
		if (index == 0) sessName = 'designFocus';
		else if (index == 1) sessName = 'designEyeContact';
		$.ajax({
			type: "GET",
			url: "getSegments.php",
			dataType: 'json',
			data: { session: sessName }, //change back to 'session'
			success: function(data){
				segments = JSON.parse(data[0]);
				// alert(segments[0][0]);
				// alert(segments);
				if(segments != null){
					$('#segments').empty(); //clear old segments
					var i = 1;                     //  set your counter to 1

					function myLoop () {           //  create a loop function
					   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
					    var max = $( "#timeSlider" ).slider( "option", "max" );
						var min = $( "#timeSlider" ).slider( "option", "min" );
						var xIncrement = 100/(max - min) * 6.4; //number of pixels per second on the slider, total width is 640 pixels

						// alert(segments[0][0]);
						// alert(segments[1][0]);
						// alert(segments[2][0]);
						// alert(segments[3][0]);
						// alert(xIncrement);
						var position = (60 + segments[i][0] * xIncrement); //120 is number of pixels from left of page to slider

						var color;
						if(index == 0) color = '#FF0000';
						else if(index == 1) color = '#0000FF';
						$('#segments').append('<div style="BACKGROUND-COLOR: '+ color + '; HEIGHT: 14px; LEFT: ' + position + 'px; POSITION: absolute; TOP: 470px; WIDTH: 3px"></div>');
					      i++;                     //  increment the counter
					      if (i < segments.length) {            //  if the counter < 10, call the loop function
					         myLoop();             //  ..  again which will trigger another 
					      }    
					      randomInterval = Math.random()*(1.5-.5+1)+.5;
						// alert(randomInterval);                 
					   }, 1000)
					}

					myLoop();  

					// for(var i = 0; i < segments.length; i++)
					// {
					// 	var max = $( "#timeSlider" ).slider( "option", "max" );
					// 	var min = $( "#timeSlider" ).slider( "option", "min" );
					// 	var xIncrement = 100/(max - min) * 6.4; //number of pixels per second on the slider, total width is 640 pixels

					// 	// alert(segments[0][0]);
					// 	// alert(segments[1][0]);
					// 	// alert(segments[2][0]);
					// 	// alert(segments[3][0]);
					// 	// alert(xIncrement);
					// 	var position = (120 + segments[i][0] * xIncrement); //120 is number of pixels from left of page to slider

					// 	// alert(position);
					// 	$('#segments').append('<div style="BACKGROUND-COLOR: #0000FF; HEIGHT: 14px; LEFT: ' + position + 'px; POSITION: absolute; TOP: 470px; WIDTH: 3px"></div>');


					// }
				}
			}
		});

	},3000);
}

$(document).ready(function(){


});