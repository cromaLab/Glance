var val = []; //sets array of values from bars
var j = 0; //used for setting up initial bar div

var clipStartingTime;
var clipEndingTime;

var numButtonsOnPage = 0;

var barAdded;

$(document).ready(function(){

  barAdded = false; //initialize to false

  $("#chooseExampleButton").on("click", function(event){
    event.preventDefault();
    addRangeBar();
    barAdded = true;
    $("#saveExampleButton").removeAttr("disabled");
    $("#chooseExampleButton").attr("disabled", "disabled");
  });

  $("#saveExampleButton").on("click", function(event){
    event.preventDefault();
      var color = getRandomColor();
      $("#tabs").append("<button style = 'background:" + color + " !important;' id = 'exampleButtonNum" + numButtonsOnPage + "'class='' onclick='sessionButtonClick(" + numButtonsOnPage + ")'>" + "Example: " + $( "#slider-range" + 0).slider( "values", 0 ).toString() + " - " + $( "#slider-range" + 0).slider( "values", 1 ).toString() + "</button></br>");
      numButtonsOnPage++;
      clipStartingTime = parseFloat($( "#slider-range" + 0).slider( "values", 0 ).toString());
      clipEndingTime = parseFloat($( "#slider-range" + 0).slider( "values", 1 ).toString());
      $("#saveExampleButton").attr("disabled", "disabled");
      $("#chooseExampleButton").removeAttr("disabled");
      $("#slider-container").html("");
  });

  $(document).on("click", '#sliderPurposeButton', function(){
    clipStartingTime = $( "#slider-range0" ).slider( "values", 0 );
    clipEndingTime = $( "#slider-range0" ).slider( "values", 1 );

    $('#sliderPurposeButton').hide();
    $('#sliderPurpose').html("Select where your action should be labeled");
  });  
});
  
function addRangeBar(){
  for( i = 0; i < 1; i++ ) {
    	//$("#slider-container").append("<div id='sliderbar-" + i + "' class='slider'><label for='amount" + i  + "'>Time range:</label> <input type='text' id='amount" + i + "' class='time-label' readonly='readonly'/><span id='sliderPurpose'>Select an example of the action to be found</span><button id='sliderPurposeButton' type='button'>Next</button><div id='slider-range" + i + "'></div></div>"); //appends first div to slider-container
      $("#slider-container").append("<div id='sliderbar-" + i + "' class='slider'><label for='amount" + i  + "'>Time range:</label> <input type='text' id='amount" + i + "' class='time-label' readonly='readonly'/><span id='sliderPurpose'>Select an example of the action to be found</span><div id='slider-range" + i + "'></div></div>"); //appends first div to slider-container    	
      //alert("(init) start:" + startTime + " --> " + startTime + ((endTime - startTime) * .25));
    	//alert("(init) end:" + endTime + " --> " + (endTime - ((endTime - startTime) * .25)));
    	$( "#slider-range" + i ).slider({
      	range: true,
      	min: startTime,
      	max: endTime,
      	step: 0.1,
      	values: [ (startTime + (endTime - startTime) * .25), (endTime - ((endTime - startTime) * .25)) ],
      	disabled: false,
      	slide: function( event, ui ) {
      		var clickedid = $(this).attr('id'); //retrieves ID currently being clicked
      		var remove ='slider-range'; //removes 'slider-range' the common part of all bar ids
      		var finalnumber = clickedid.replace(remove,''); //just gets the number of the id
      		if((ui.values[1] - ui.values[0]) <= 1.6)
  		{
  			//alert("returning false -- too close?")
  			return false;
  		}
          $( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 
        		   
      	},
      	stop: function(event, ui) {
  	      var clickedid = $(this).attr('id');
      		var remove ='slider-range';
      		var finalnumber = clickedid.replace(remove,'');
  	      val[(2*finalnumber)] = ui.values[0]; //fills array with values
  	      val[(2*finalnumber)+1] = ui.values[1];
  	      //alert("joined val first: " + val.join('\n'));
      	}
   	});           
  //alert("range: " + $( "#slider-range" + i).slider( "values", 0 ) );
  $( "#amount" + i ).val( $( "#slider-range" + i).slider( "values", 0 ) + "s - " + $( "#slider-range" + i).slider( "values", 1 ) +"s");

  // WSL: Total and utter hack to get the 2nd slider value to be red
  $('#slider-range'+i+' a')[1].style["background"] = "#A00";
  $('#slider-range'+i+' a')[1].style["border-color"] = "#800";


  }
}

function getRandomColor () {
  var hex = Math.floor(Math.random() * 0xFFFFFF);
  return "#" + ("000000" + hex.toString(16)).substr(-6);
}