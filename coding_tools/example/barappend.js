
	


	var activeBarID = 0;
 	function toggleStatus(clicked_id) {
 		if(clicked_id.match("^toggleElement"))
 		{
 			var remove ='toggleElement';
 			var temp = clicked_id;
 			var finalnumber = clicked_id.replace(remove,'');
			var slider_onoff = document.getElementById('slider-range'+ finalnumber);
			var slider_above = document.getElementById('slider-range'+ (finalnumber - 1));
			var slider_below = document.getElementById('slider-range'+ (finalnumber + 1));
			var tester = document.getElementById('slider-container').childNodes;
			
			// Deactivate the add-bar button
			$("#addbar").attr('disabled', 'disabled');

			if(document.getElementById(temp).value == "Edit")
			{
                                       	makeThisActive($("#sliderbar-"+parseInt(clicked_id.substring(13))));
			}
			else if(document.getElementById(temp).value == "Done"){ 	// appends a bar when the last 'Done' is clicked and disables bars when they arent being edited
				var value_of_next_bar = $(slider_onoff).slider("option","values");
				var a = parseFloat(value_of_next_bar[1]);
				var b = parseFloat(value_of_next_bar[1] + 10);
				window.a = a;
				window.b = b;
				// Deactivate the new slider
				deactivBar(activeBarID);
					
				var num_check = parseInt(finalnumber);
				if((num_check + 1) == (tester.length/3))
				{
						var n = 1 + j;
						j = j + 1;

						$("#slider-container").append("<div id='sliderbar-" + n + "' class='slider'><p><label for='amount" + n  + "'>Time range:</label> <input type='text' id='amount" + n + "' class='time-label' readonly='readonly'/> </p> <div id='slider-range" + n + "'></div></div>Click to change: <input id='toggleElement" + n + "' type='button' name='toggle' onclick='toggleStatus(this.id)' value='Done' />");
						$( "#slider-range" + n ).slider({
							range: true,
							min: startTime,
							max: endTime,
							step: 0.1,
							values: [ a,b ],
							disabled: false,
				
							slide: function( event, ui ) {
								var clickedid = $(this).attr('id');
								var remove ='slider-range';
								var finalnumber = clickedid.replace(remove,'');
								
								var parseID = parseInt(finalnumber);
								var int_prev_bar = parseID - 1;
								var check_behind = $( "#slider-range" + int_prev_bar ).slider( 'values', 1);
								if(ui.values[0] < check_behind) 
								{
									return false;
								}
								if((ui.values[1] - ui.values[0]) <= 1.6)
								{
									return false;
								}
								$( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 

							},
							change: function(event, ui) {
						
							},
							stop: function(event, ui) {
								var clickedid = $(this).attr('id');
								var remove ='slider-range';
								var finalnumber = clickedid.replace(remove,'');
								val[(2*finalnumber)] = ui.values[0];
								val[(2*finalnumber)+1] = ui.values[1];
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
				else {
					// No slider is active
					$("#addbar").removeAttr("disabled");
				}
			}
 		}
 	}

