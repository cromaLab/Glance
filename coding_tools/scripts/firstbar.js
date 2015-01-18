var val = []; //sets array of values from bars
var j = 0; //used for setting up initial bar div
var videoLength = (endTime - startTime);


  $(document).ready( function() { 		
	for( i = 0; i < 1; i++ ) {
    	$("#slider-container").prepend("<div id='sliderbar-" + i + "' class='slider'><button class='removeButton' onclick='removeMe(" + i + ")' id='removeButton" + i + "'>×</button><p style='font-size: 9pt'><label for='amount" + i  + "'>Event #" + (i+1) + " Range:</label> <input type='text' id='amount" + i + "' class='time-label' readonly='readonly'/> </p> <div id='slider-range" + i + "'></div><div class='confidence-header'>Confidence in this answer: <select id='confidence-" + i + "'><option>High</option><option>Medium</option><option>Low</option></select></div></div>"); //appends first div to slider-container to the top of the list
  	  	//alert("(init) start:" + startTime + " --> " + startTime + ((endTime - startTime) * .25));
  	  	//alert("(init) end:" + endTime + " --> " + (endTime - ((endTime - startTime) * .25)));
      	$( "#slider-range" + i ).slider({
        	range: true,
        	min: (startTime - startTime),
        	max: (endTime - startTime),
        	step: 0.1,
        	values: [ ((endTime - startTime) * .25), ((endTime - startTime) * .75) ],
        	disabled: false,
        	slide: function( event, ui ) {
        		var clickedid = $(this).attr('id'); //retrieves ID currently being clicked
        		var remove ='slider-range'; //removes 'slider-range' the common part of all bar ids
        		var finalnumber = clickedid.replace(remove,''); //just gets the number of the id
        		if((ui.values[1] - ui.values[0]) <= videoLength * .01)
				{
					//alert("returning false -- too close?")
					return false;
				}
          		$( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 
          		
			$('#timeSlider').slider({ value: ui.value + startTime });
			player.seekTo(ui.value + startTime);
        	},
        	stop: function(event, ui) {
			var clickedid = $(this).attr('id');
        	var remove ='slider-range';
        	var finalnumber = clickedid.replace(remove,'');
        	
			val[(2*finalnumber)] = (ui.values[0] + startTime); //fills array with values
			val[(2*finalnumber)+1] = (ui.values[1] + startTime);
			//alert(val.join('\n'));
        	}
     	});           
	//alert("range: " + $( "#slider-range" + i).slider( "values", 0 ) );
	$( "#amount" + i ).val( $( "#slider-range" + i).slider( "values", 0 ) + "s - " + $( "#slider-range" + i).slider( "values", 1 ) +"s");

	// WSL: Total and utter hack to get the 2nd slider value to be red
	$('#slider-range'+i+' a')[1].style["background"] = "#A00";
	$('#slider-range'+i+' a')[1].style["border-color"] = "#800";

	// Add the onClick function to swap this element with the currently active one when clicked	
	$("#sliderbar-"+i).click( function() {
		makeThisActive(this);

		// Do not pass the click event on to higher levels
		return false;
	});

	}

 $("#addbar").click(function() {   //appends a bar when ADD is clicked
 		var n = 1 + j;
 		j = j + 1;
		activeBarID = n;

		// On click, activate this slider
		$("#sliderbar-"+activeBarID).click( function() {
			makeThisActive(this);
		});
		$("#addbar").attr("disabled","disabled");

 		var value_of_next_bar = $( "#slider-range" + (n - 1) ).slider("option","values");
		var a = parseFloat(value_of_next_bar[1]);
		var b = parseFloat(value_of_next_bar[1] + 10);
 		      		
  	  	$("#slider-container").prepend("<div id='sliderbar-" + n + "' class='slider'><p><label for='amount" + n  + "'>Event #" + (n+1) + " Range:</label> <input type='text' id='amount" + n + "' class='time-label' readonly='readonly'/> </p> <div id='slider-range" + n + "'></div></div><input id='toggleElement" + n + "' type='button' name='toggle' onclick='toggleStatus(this.id)' value='New' /><br/>");
      	$( "#slider-range" + n ).slider({
        	range: true,
        	min: startTime,
        	max: endTime,
        	step: 0.1,
        	values: [ a, b ],
        	disabled: false,
        	slide: function( event, ui ) {
        		var clickedid = $(this).attr('id');
        		var remove ='slider-range';
        		var finalnumber = clickedid.replace(remove,'');
          		$( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 

			$('#timeSlider').slider({ value: ui.value + startTime });
			player.seekTo(ui.value + startTime);
        	},
        	stop: function(event, ui) {
				var clickedid = $(this).attr('id');
        		var remove ='slider-range';
        		var finalnumber = clickedid.replace(remove,'');
				val[(2*finalnumber)] = ui.values[0];
				val[(2*finalnumber)+1] = ui.values[1];
				
        		
        		var clickedid_2 = 'slider-range';
        		var finalnum = parseInt(finalnumber)
        		var next_bar_id_num = finalnum + 1;
        		var value_of_next_bar = $( "#slider-range" + finalnumber ).slider("option","values");
        		var diff = value_of_next_bar[1] - value_of_next_bar[0];
        		
        		$( "#slider-range" + next_bar_id_num ).slider("option", "values", [value_of_next_bar[1], value_of_next_bar[1] + 10]);
        	}
     	});           
	$( "#amount" + n ).val( $( "#slider-range" + n).slider( "values", 0 ) + "s - " + $( "#slider-range" + n).slider( "values", 1 ) +"s");

	// WSL: Total and utter hack to get the 2nd slider value to be red
	$('#slider-range'+n+' a')[1].style["background"] = "#A00";
	$('#slider-range'+n+' a')[1].style["border-color"] = "#800";
});

	$("#addbar").attr("disabled","disabled");


 });

	// Makes the current elem (intended to be 'this' passed in from the calling
	//  onClick function) the active one, and deactivates the previous active bar
	//  if there was one. This just wraps the 2 activ/deactiv Bar functions.
	function makeThisActive(elem) {
		if( $(elem).hasClass("inactive") ) {
			// Deactivate the old element if there is one
			if( activeBarID != null ) {
				//alert("DEACTIVATING: " + activeBarID);
				deactivBar(activeBarID);
			}

			// Activate the clicked element (parsed from "sliderbar-#")
			//alert("ACTIVATING: " + parseInt($(elem).attr('id').substring(10)))
			activBar(parseInt($(elem).attr('id').substring(10)));
		}

		var remove_for_id = elem.id;
		var remove = "sliderbar-";
		var iD = remove_for_id.replace(remove,'');
		   $('.edit_text' + iD).remove();

	}


	// Passed a bar element index, this deactives it (leaving the active handle NULL.
	function deactivBar(id) {
		// Set the slider div itself and range text to inactive (for styling)
		$("#sliderbar-"+id).addClass('inactive');
		$("#amount"+id).addClass('inactive');
		// Set the range slider within the div to inactive
		$("#slider-range"+id).slider('disable');
		// Change the button value of the currently select slider to 'Edit'
		//$("#toggleElement"+id).val("Edit");
		$("#toggleElement"+id).hide();
		activeBarID = null;
		//$("<p z-index=2 style:font-size:'16' class='edit_text" + id  + "'> Click to edit </p>").appendTo("#sliderbar-"+id);
	}

	// Passed a bar element index, this activates the bar and sets the active handle.
	function activBar(id) {
		// Set the slider div itself and range text to active (for styling)
		$("#sliderbar-"+id).removeClass('inactive');
		$("#amount"+id).removeClass('inactive');
		// Set the range slider within the div to active
		$("#slider-range"+id).slider('enable');
		// Change the button value of the currently select slider to 'New'
		$("#toggleElement"+id).val("Done");
		if(id == numBars - 1)$("#toggleElement"+id).show();
		activeBarID = id;
	}

	function removeMe(id){
		// var divId = $("#sliderbar-" + id).closest("div").attr("id");
		// $('#' + id).parents("div:first").block({ message: null });
		//$('#removeButton' + (id - 1)).show();
		for(var i = 0; i < numBars; i++){
			deactivBar(i);
		}

		// deactivBar(numBars - 1);

		$('#sliderbar-' + id).remove();
		$('#toggleElement' + id).remove();

		for(var i = id + 1; i < numBars; i++){
			$("#slider-range" + i).attr('id', "slider-range" + (i-1));
			$("#confidence-" + i).attr('id', "confidence-" + (i-1));
			$("#sliderbar-" + i).attr('id', "sliderbar-" + (i-1));
			$("#amount" + i).attr('id', "amount" + (i-1));

			$("#removeButton" + i).attr('onclick', "removeMe(" + (i-1) + ")");
			$("#removeButton" + i).attr('id', "removeButton" + (i-1));
		}

		val.splice(id*2, 1);
		val.splice(id*2, 1);	
		j--;
		numBars--;
		if(numBars == 0) numBars--;
		
		if($('#toggleButton').data('state') == 'setEnd'){
			$('#toggleButton').click();
			return false;
		}

		// $('#toggleButton').data('state', 'setStart');
 	// 	$('#toggleButton').html('Set Start');
		// alert(divId);

	}

