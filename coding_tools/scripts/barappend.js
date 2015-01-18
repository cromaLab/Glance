	$(document).ready(function(){
		$('#slider-range0').find('.ui-slider-handle').hide();
		$('#slider-range0').find('.ui-slider-range').hide();
		$('#removeButton0').hide();
		$( "#amount0" ).val(0 + "s - " + 0 +"s");

		$('#toggleButton').on('click', function(){
			toggleStatus($(this).data('state'));
		});

		setTimeout( checkSubmit, 1000 );
	});

	function checkSubmit() {
		if( submittableTime && submittablePlayer ) {
			// Enable submit
			$("#legion-submit").removeAttr("DISABLED"); //enables submit button if video has ended
		}
		else {
			// Check again later
			setTimeout( checkSubmit, 1000 );
		}
	}

	function recordChanges(){
 		var final_bar = $( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "option" , "values");
        var leftFinal = final_bar[0];
        var rightFinal = final_bar[1];
        val[(2*activeBarID)] = (leftFinal + startTime);
        val[(2*activeBarID) + 1] = (rightFinal + startTime );
        $( "#amount" + activeBarID ).val((parseFloat(leftFinal)) + "s - " + (parseFloat(rightFinal)) +"s");
    }

	var activeBarID = 0;
	var numBars = 0;

	var autoMoveRight;

	var clickedSetStartOnce = false;

 	function toggleStatus(clicked_id) {
 		if(!clickedSetStartOnce){
 			clickedSetStartOnce = true;
 			
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

 		var currentTime = player.getCurrentTime();

 		if(clicked_id == "setStart"){
 			 var currentTimeLeft = parseFloat((currentTime - startTime).toFixed(3));

 			if(numBars >= 1){
 				addBar(clicked_id);
 			}
 			else if(numBars == 0){
 				numBars = 1;
 				$('#slider-range0').find('.ui-slider-handle').show();
				$('#slider-range0').find('.ui-slider-range').show();
				$('#removeButton0').show();
 			}
 			else if (numBars == -1){
 				numBars = 0;
 				addBar(clicked_id);
 			}

 			$( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "values", 0, parseFloat(currentTimeLeft) );

 			$('#toggleButton').data('state', 'setEnd');
			$('#toggleButton.button').css('background', '-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #e57846), color-stop(1, #ce6542) )');
			$('#toggleButton.button').css('box-shadow', 'inset 0px 1px 0px 0px #fd99ae');
			$('#toggleButton.button').css('-webkit-box-shadow', 'inset 0px 1px 0px 0px #fd99ae');
			$('#toggleButton.button').css('border', '1px solid #c6430a');
 			$('#toggleButton').html('Set End');
 			recordChanges();

 			autoMoveRight=setInterval(function(){//automatically moves the end piece
 				$( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "values", 1, parseFloat((player.getCurrentTime() - startTime).toFixed(3)) );
 				$( "#amount" + (parseFloat(numBars) - 1) ).val((parseFloat(currentTimeLeft)) + "s - " + parseFloat((player.getCurrentTime() - startTime).toFixed(3)) +"s");
 			},100);


 		}

 		else if(clicked_id == "setEnd"){
 			window.clearInterval(autoMoveRight);

 			var currentTimeRight = parseFloat((currentTime - startTime).toFixed(3));
 			var val_bar = $( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "option" , "values");

 			if(currentTimeRight - parseFloat(val_bar[0]) < videoLength * .01){ //if end pin is trying to go too close to the start pin
 				$( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "values", 1, (parseFloat(currentTimeRight) + videoLength * .01) );
 			}
 			else {
 				$( "#slider-range" + (parseFloat(numBars) - 1) ).slider( "values", 1, parseFloat(currentTimeRight) );
 			}
 			$('#toggleButton').data('state', 'setStart');
			$('#toggleButton.button').css('background', '-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #b8e356), color-stop(1, #a5cc52) )');
			$('#toggleButton.button').css('box-shadow', 'inset 0px 1px 0px 0px #b8e356');
			$('#toggleButton.button').css('-webkit-box-shadow', 'inset 0px 1px 0px 0px #b8e356');
			$('#toggleButton.button').css('border', '1px solid #83c41a');
 			$('#toggleButton').html('Set Start');
 			recordChanges();
 		}
        

 		else if($(temp).hasClass("inactive"))
		{
        	makeThisActive($("#sliderbar-"+parseInt(clicked_id.substring(13))));                               
		}
	}


 		function addBar(clicked_id)
 		{
 			var remove ='toggleElement';
 			var temp = clicked_id;
 			var finalnumber = activeBarID;
			var slider_onoff = document.getElementById('slider-range'+ finalnumber);
			var slider_above = document.getElementById('slider-range'+ (finalnumber - 1));
			var slider_below = document.getElementById('slider-range'+ (finalnumber + 1));
			var tester = document.getElementById('slider-container').childNodes;
			
			// Deactivate the add-bar button
			$("#addbar").attr('disabled', 'disabled');

			//if(document.getElementById(temp).value == "Edit")
		
			// function addBar(){// if(document.getElementById(temp).value == "Done"){ 	// appends a bar when the last 'Done' is clicked and disables bars when they arent being edited
				var value_of_next_bar = $(slider_onoff).slider("option","values");
				var a = parseFloat(value_of_next_bar[1]);
				var b = parseFloat(value_of_next_bar[1] + 5);
				window.a = a;
				window.b = b;
				// Deactivate the new slider
				deactivBar(activeBarID);
					
				var num_check = parseInt(finalnumber);
				// if(true)//((num_check + 1) == (tester.length/3))
				
						var n = 1 + j;
						j = j + 1;

						numBars++;

						//$("#slider-container").prepend("<a class='button2 blue' id='toggleElement" + n + "' onclick='toggleStatus(this.id)'>+ Add event</a><div id='sliderbar-" + n + "' class='slider'><p style='font-size: 9pt'><label for='amount" + n  + "'>Event #" + (n+1) + " Range:</label> <input type='text' id='amount" + n + "' class='time-label' readonly='readonly'/> </p> <div id='slider-range" + n + "'></div><div class='confidence-header'>Confidence in this answer: <select id='confidence-" + n + "'><option>High</option><option>Medium</option><option>Low</option></select></div></div></div></br>");
						$("#slider-container").prepend("<div id='sliderbar-" + n + "' class='slider'><button class='removeButton' onclick='removeMe(" + n + ")' id='removeButton" + n + "'>×</button><p style='font-size: 9pt'><label for='amount" + n  + "'>Event #" + (n+1) + " Range:</label> <input type='text' id='amount" + n + "' class='time-label' readonly='readonly'/> </p> <div id='slider-range" + n + "'></div><div class='confidence-header'>Confidence in this answer: <select id='confidence-" + n + "'><option>High</option><option>Medium</option><option>Low</option></select></div></div></div>").fadeIn('slow');
						
						//$('#removeButton' + (n-1)).hide();//hides previous remove button

						$( "#slider-range" + n ).slider({
							range: true,
							min: (startTime - startTime),
							max: (endTime - startTime),
							step: 0.1,
							values: [ 0,0 ],
							disabled: false,
				
							slide: function( event, ui ) {
								var clickedid = $(this).attr('id');
								var remove ='slider-range';
								var finalnumber = clickedid.replace(remove,'');
								
								var parseID = parseInt(finalnumber);
								var int_prev_bar = parseID - 1;
								var check_behind = $( "#slider-range" + int_prev_bar ).slider( 'values', 1);
								// if(ui.values[0] < check_behind) 
								// {
								// 	return false;
								// }
								if((ui.values[1] - ui.values[0]) <= videoLength * .01)
								{
									return false;
								}
								$( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 

								$('#timeSlider').slider({ value: ui.value + startTime });
								player.seekTo(ui.value + startTime);
							},
							change: function(event, ui) {
							},
							stop: function(event, ui) {
								var clickedid = $(this).attr('id');
								var remove ='slider-range';
								var finalnumber = clickedid.replace(remove,'');
								val[(2*finalnumber)] = (ui.values[0] + startTime);
								val[(2*finalnumber)+1] = (ui.values[1] + startTime); 

							}
						});

						// Add the onClick function to swap this element with the currently active one when clicked     
						$("#sliderbar-"+n).click( function () {
							makeThisActive(this);

                					// Do not pass the click event on to higher levels
                					return false;
						});


					  	$( "#amount" + n ).val( $( "#slider-range" + n).slider( "values", 0 ) + "s - " + $( "#slider-range" + n).slider( "values", 1 ) +"s");

						// Activate the current element (index n)
						activBar(n);

						// WSL: Total and utter hack to get the 2nd slider value to be red
						$('#slider-range'+n+' a')[1].style["background"] = "#A00";
						$('#slider-range'+n+' a')[1].style["border-color"] = "#800";
                   		


							
				}
