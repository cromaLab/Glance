var getSegmentsInterval;

var tabClicked = function(event){	

	window.clearInterval(getSegmentsInterval); //clear interval from other sessions
	$('#segments').empty(); //clear any segments marked from other sessions

	var index = $( "#tabs" ).tabs( "option", "active" ); //index of tab clicked
	var session = sessions[index]; //gets session from array of session names
	var segments = new Array();

	var randomInterval;

	var sessName;
	// alert('index:' + index);
	if (index == 0) sessName = 'designExcitementBaseline2';
	else if (index == 1) sessName = 'designPositivelyBaseline2';

	$.ajax({
			type: "GET",
			url: "getSegments.php",
			dataType: 'json',
			async: false,
			data: { session: session }, //change back to 'session'
			success: function(data){
				segments = JSON.parse(data[0]);
			}
	});

	function doSetTimeout(i) {
		var timeNum = (Math.random()*(1.5-.5+1)+.5) * 1000;
		// alert(timeNum);
  		setTimeout(function() { myLoop(i); }, timeNum);
	}

	for (var i = 0; i <= segments.length; ++i)
	  doSetTimeout(i);

	function myLoop (i) {           //  create a loop function
    var max = $( "#timeSlider" ).slider( "option", "max" );
	var min = $( "#timeSlider" ).slider( "option", "min" );
	var xIncrement = 100/(max - min) * 6.4; //number of pixels per second on the slider, total width is 640 pixels
	var position = (60 + segments[i][0] * xIncrement); //120 is number of pixels from left of page to slider

	var color;
	if(index == 0) color = '#FF0000';
	else if(index == 1) color = '#0000FF';
	$('#segments').append('<div style="BACKGROUND-COLOR: '+ color + '; HEIGHT: 14px; LEFT: ' + position + 'px; POSITION: absolute; TOP: 470px; WIDTH: 3px"></div>');
	}
}


$(document).ready(function(){


});