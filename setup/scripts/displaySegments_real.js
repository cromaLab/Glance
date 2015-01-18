var getSegmentsInterval;

var tabClicked = function(event){	

	window.clearInterval(getSegmentsInterval); //clear interval from other sessions
	$('#segments').empty(); //clear any segments marked from other sessions

	var index = $( "#tabs" ).tabs( "option", "active" ); //index of tab clicked
	var session = sessions[index]; //gets session from array of session names
	var segments = new Array();

	getSegmentsInterval = setInterval(function(){

		$.ajax({
			type: "GET",
			url: "getSegments.php",
			dataType: 'json',
			data: { session: session },
			success: function(data){
				segments = JSON.parse(data[0]);
				// alert(segments);
				if(segments != null){
					$('#segments').empty(); //clear old segments
					for(var i = 0; i < segments.length; i++)
					{
						var max = $( "#timeSlider" ).slider( "option", "max" );
						var min = $( "#timeSlider" ).slider( "option", "min" );
						var xIncrement = 100/(max - min) * 6.4; //number of pixels per second on the slider, total width is 640 pixels

						var position = (120 + segments[i][0] * xIncrement); //120 is number of pixels from left of page to slider

						// alert(position);
						$('#segments').append('<div style="BACKGROUND-COLOR: #0000FF; HEIGHT: 14px; LEFT: ' + position + 'px; POSITION: absolute; TOP: 470px; WIDTH: 3px"></div>');
					}
				}
			}
		});

	},5000);
}

$(document).ready(function(){


});