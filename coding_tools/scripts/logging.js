$(document).ready( function() {
	if(gup("mode") == "rabbit"){
		$("#legion-submit").unbind('click');

		$("#legion-submit").click(function() {
			alert("Submitting, please wait");
			// logSubmitTime();
			finalSubmit();
		});
	}
	else{
		$("#legion-submit").unbind('click');

		$("#legion-submit").click(function() {
			alert("Submiting");
			if(checkSegmentsForOverlaps()){
				if(numBars <= 0){
					var confirmSubmit = confirm("Are you the event never occured?");
					if(confirmSubmit){
						logging();
					}
				}

				else{
					logging();
				}
			}
			else{
				alert("One of more of your events are overlapping, please correct this.");
			}
		});
	}
});

function finalSubmit(){
	updateActive();
	logSubmitTime();
	$("#legion-submit").attr("disabled", "disabled");

	if(gup("lineup") == "true"){
		// alert("lineup");

		url = "../lineup/index.php";

		url += "?setupId=" + gup("setupId");
		url += "&turkSubmitTo=" + gup("turkSubmitTo");
		url += "&workerId=" + gup("workerId");
		url += "&assignmentId=" + gup("assignmentId");
		url += "&hitId=" + gup("hitId");
		url += "&mode=" + gup("mode");
		url += "&session=" + row[0].session;
		url += "&clipIndex=" + row[0].clipIndex;

		setTimeout(function(){window.location = url;},3000);
	}
	else{
		// alert("no lineup");
		setTimeout(function(){submitToTurk();},3000);
	}
}

function checkSegmentsForOverlaps(){
	for(var i = 0; i < numBars; i++){
		for(var j = 0; j < numBars; j++){
			var bar1 = $( "#slider-range" + i ).slider( "option" , "values");
			var bar2 = $( "#slider-range" + j ).slider( "option" , "values");

			var start1 = bar1[0];
			var end1 = bar1[1];
			var start2 = bar2[0];
			var end2 = bar2[1];

			if(j != i && (end1 >= start2 && end1 <= end2 || start1 >= start2 && start1 <= end2)) //overlapping
			{
				return false;
			}
		}
	}
	return true;	
}

function updateActive(){
	$.ajax({
    		url: "../workrouter/php/updateFinished.php",
    		aync: false,
    		//data: {worker: gup('workerId'), intime: val[i], outtime: val[i+1], session: row[0].session, confidence: confidence, clipIndex: row[0].clipIndex},
    		data: {setupId: gup('setupId')},
    		dataType: "text",
    		success: function(d) {alert(d);},
    		failed: function(){alert('Logging failed');}
		});
}


function logging() {	
	var j = 0;
	for(var i = 0; i < numBars; i++)
	{
		alert("log"); //DO NOT COMMENT OUT. THIS FIXES A MAJOR LOGGING BUG... SOMEHOW
		var final_bar = $( "#slider-range" + j ).slider( "option" , "values");
		var leftFinal = final_bar[0] + startTime;
        var rightFinal = final_bar[1] + startTime;

		//gets confidence value of each entry
		var confidence = $( "#confidence-" + j + " option:selected" ).text();
		j++;

		//alert("Sending :: " + val[i+1]);
		$.ajax({
    		url: "php/logSegments.php",
    		aync: false,
    		//data: {worker: gup('workerId'), intime: val[i], outtime: val[i+1], session: row[0].session, confidence: confidence, clipIndex: row[0].clipIndex},
    		data: {worker: gup('workerId'), intime: leftFinal, outtime: rightFinal, session: row[0].session, confidence: confidence, clipIndex: row[0].clipIndex},
    		dataType: "text",
    		success: function() {},
    		failed: function(){alert('Logging failed');}
		});
		
	}

	finalSubmit();
}
