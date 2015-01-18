//Enables LegionJS submit button if a slider has been moved at least once
$( document ).ready(function() {
	if(gup("mode") == "rabbit"){
		$("#action").html(row[0].action);
	  	$("#description").html(row[0].description);

	  	if(gup('workerId') == "") alert("Remember to accept the HIT before continuing!");

	  	var switchIsOn = false;
	  	var sawOnce = false; //set true the first time "I saw it" is clicked

	  	var rowId; //will store id segment row in the db

	  	function logInSubmittedFieldWhenToggled(){
	  		$.ajax({
	  			url: "php/logVisited.php",
	  			aync: false,
	  			data: {id: logId},
	  			dataType: "text",
	  			success: function() {
	  			},
	  			failed: function(){alert('Logging failed');}
	  		});
	  	}

	  	$('#myonoffswitch').click(function() {
	  		// alert("flipped");
	  		
	      $('#myonoffswitch').attr("disabled", "true");
	      setTimeout(function(){
	        // alert("success");
	        $('#myonoffswitch').removeAttr("disabled");
	      },1000);

	  		var currentTimeVideo = player.getCurrentTime();

	  		if(!sawOnce){
	  			sawOnce = true;

	  			//Logs real-world timestamp of first time worker clicked "I saw it"
	  			$.ajax({
	  				url: "php/logVisited.php",
	  				aync: false,
	  				data: {id: logId, firstTimeSawIt: "true"},
	  				dataType: "text",
	  				success: function() {
	  				},
	  				failed: function(){alert('Logging failed');}
	  			});
	  		}

	  		if(!switchIsOn){
	  			switchIsOn = true;

	  			$("#legion-submit").removeAttr("DISABLED"); //enable submit button

				$.ajax({
		    		url: "php/logSegments.php",
		    		aync: false,
		    		//data: {worker: gup('workerId'), intime: val[i], outtime: val[i+1], session: row[0].session, confidence: confidence, clipIndex: row[0].clipIndex},
		    		data: {worker: gup('workerId'), intime: parseFloat(row[0].start), outtime: parseFloat(row[0].end), session: row[0].session, confidence: currentTimeVideo, clipIndex: row[0].clipIndex},
		    		dataType: "text",
		    		success: function(d) {
		    			rowId = d;
		    		},
		    		failed: function(){alert('Logging failed');}
				});

				// alert(logId);
				logInSubmittedFieldWhenToggled();
	  		}
	  		else{
	  			switchIsOn = false;
				// alert(rowId);
				$.ajax({
		    		url: "php/deleteSegmentById.php",
		    		aync: false,
		    		data: {id: rowId},
		    		dataType: "text",
		    		success: function() {
		    			
		    		},
		    		failed: function(){alert('Deletion failed');}
				});

				logInSubmittedFieldWhenToggled();

	  		}
	  	});

	}
	else{
		$("#action").html(row[0].action);
	  	$("#description").html(row[0].description);

	  	if(gup('workerId') == "") alert("Remember to accept the HIT before continuing!");

		var submitTimer = window.setInterval(function(){
			//val will contain a value once a slider has been moved
			if(val.length > 0) {
				$("#legion-submit").removeAttr("DISABLED");
				window.clearInterval(submitTimer);
			}
		}, 200);
	}

});


