$(document).ready( function() {
	// alert("test");
	$("#legion-submit").unbind('click');
	$("#legion-submit").val("CONTINUE");
	$("#legion-submit").click(function() {
		if(checkSegmentsForOverlaps()){
			if(numBars <= 0){
				var confirmSubmit = confirm("Are you the event never occured?");
				if(confirmSubmit){
					logging();
				}
			}

			else logging();
		}
		else{
			alert("One of more of your events are overlapping, please correct this.");
		}
	});

});

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

function logging() {	
	var numCorrect = 0;
	var correctArray = [];
	// alert(val);
	var answers = [[85+ 10,85+ 12],[85+ 17,85+ 19]];//modify this this change the expected answers
	for(var i = 0; i < numBars; i++)
	{
		for(var k = 0; k < answers.length; k++){
			var allCorrectSub = true;
			var bar1 = $( "#slider-range" + i ).slider( "option" , "values");
			if(checkCorrectness(parseFloat(bar1[0] + startTime), answers[k][0]) && checkCorrectness(parseFloat(bar1[1] + startTime), answers[k][1])){
				numCorrect++;
				correctArray.push(true);
			}
			else correctArray.push(false);
		}

	}

	if(val.length == null){
		alert("You did not mark all of the events, please check your segments.");
		return;
	}
	else if(numCorrect == answers.length && numCorrect == val.length/2){ //just right
        alert("Correct, now forwarding you to the next page.");
        $("#legion-submit").attr("disabled", "disabled");
        // Log successful completion of tutorial
        $.ajax({
        	url: "php/checkTutorialNew.php",
        	aync: false,
        	data: {workerId: gup('workerId'), mode: gup("mode"), addWorkerToList: "true"},
        	dataType: "text",
        	success: function(d) {
        		// alert("logged in tutorial table");
        		logId = d;
        	},
        	failed: function(){alert('Logging failed');}
        });

        setTimeout(function() {
          window.location = url;
        }, 1500);
	}
	else if (val.length / 2 > answers.length){ //too many segments
		alert("You marked too many events, please check your segments.");
	}
	else if(val.length / 2 < answers.length){ //too few segments
		alert("You did not mark all of the events, please check your segments.");
	}
	else{
		var index = jQuery.inArray(false, correctArray);
		alert("Please check event number " + (index + 1) + " and try again.");
	}

}

function checkCorrectness(input, solution){
	if(input > solution - 2.5 && input < solution + 2.5) return true;
	else return false;
}
