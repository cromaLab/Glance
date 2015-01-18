var val = []; //sets array of values from bars
var j = 0; //used for setting up initial bar div

var clipStartingTime;
var clipEndingTime;

var activeZoom = null;

$(document).ready(function(){
  $(document).on("click", '#sliderPurposeButton', function(){
    clipStartingTime = $( "#slider-range0" ).slider( "values", 0 );
    clipEndingTime = $( "#slider-range0" ).slider( "values", 1 );

    $('#sliderPurposeButton').hide();
    $('#sliderPurpose').html("Select where your action should be labeled");
  }); 

  populateUrlSpans();
 
});

function populateUrlSpans(){
	var setupPageUrl = document.URL;
	var baseUrl = setupPageUrl.replace(/setup\//, "");
	$("#urlToSendWorkers").html(baseUrl + 'coding_tools/instructions.php?lineup=false&mode=full');
	$("#urlToSendWorkers").attr("href", baseUrl + 'coding_tools/instructions.php?lineup=false&mode=full')
	$("#visToolUrl").html(baseUrl + 'vis_tools/index.php');
	$("#visToolUrl").attr("href", baseUrl + 'vis_tools/index.php')
}

function remove_bar(id){	
	
	$('#vbar_'+id).remove();
		
}

function slide_down_all(id){
	
	var counter = $('#iframe_working').val();
	
	for(var i=0;i<=counter;i++){
		if(id != i)
		$('#table_'+i+' tr:nth-child(2)').remove();
	}
		
}

function zoomcontent(id){

console.log("ZOOMING!");
	
	//slide_down_all(id);
	
	//var count  = $('#table_'+id+' tr').length;
//	
//	if(count >= 2){
//		 $('#table_'+id+' tr:nth-child(2)').remove();
//		 return false;
//	}
	

// To shrink:
	if( $('#iframe_' + id + ' .absolute-content').css('display') == 'none' ) {
console.log("Shrinking bar...");
		var height = 70;
		$('#iframe_' + id + ' .absolute-content').show(); // WSL: New | TODO: add re-add code on bar click()
		$('#zoomBtn_'+id).val($("<div>").html("&#x25BC;").text());
		$('#vbar_'+id).css("border", "1px solid #ddd");
	
		activeZoom = null;
	}
	else {
// To expand:
console.log("Expanding bar...");
		var height = 150;
		$('#iframe_' + id + ' .absolute-content').hide(); // WSL: New | TODO: add re-add code on bar click()
		$('#zoomBtn_'+id).val($("<div>").html("&#x25B2;").text());
		$('#vbar_'+id).css("border", "4px solid #444");
	
		
		if( activeZoom != null ) {
			var azID = activeZoom;
			activeZoom = null;
			zoomcontent(azID);
		}

		activeZoom = id;
	}
	
	$('#vis_tool_iframe'+id).height(height);

	
// To Add:
/*
	value = $("#"+id+"_text").val();
	
	var iframe = '<iframe  class="iframe_style_new" id="vis_tool_iframe_big'+id+'" width="100%" height="'+height+'" src="http://roc.cs.rochester.edu/convInterface/videocoding/tools/vis_tools/?session='+value+'&details=false&embedded=true" frameborder="0"></iframe>';
	
	var html = "<tr><td colspan='3'>"+iframe+"</td></tr>";
	
	$('#table_'+id).append(html);

*/

}

function addBar(){
	
	var iframe  = '';
	var height = 60;
	var value = '';
	var counter = $('#iframe_working').val();
	var label_value = '';
		
	iframe = '';
	
	var counter_new = parseInt(counter);
	counter = counter_new+1;
		
	var content =  '<li id="vbar_'+counter+'" class="thumbnail"><table width="99%" id="table_'+counter+'"><tr><td colspan="3" width="100%" align="center"><span id="iframe_'+counter+'">'+iframe+'</span></td></tr><tr><td width="15%" align="center"><img class="icon-remove" src="images/remove_icon.png" onclick="remove_bar('+counter+')" />&nbsp&nbsp&nbsp&nbsp&nbsp<input placeholder="session" onKeyUp="refersh_content('+counter+',event)" class="left_text_width" align="center" id="'+counter+'_text" type="text" id="someid" value="'+label_value+'" /></td><td width="70%" align="center"><input type="button" id="zoomBtn_'+counter+'" value="&#x25BC;"/></td><td align="right" width="15%"><input type="button" onclick="render_new('+counter+',1)" class="btn btn-primary" value="Go" id="go_'+counter+'" /></td></tr></table></li>';
		
	$('#iframe_working').val(counter);
	
	$('#bars_maker').append(content);
	
	$('#zoomBtn_' + counter).click( function() {
		zoomcontent(counter);
		loadBarData(counter);
	});
	
	if($('#vis_tool_iframe'+counter).length){
		$('#zoomBtn_'+counter).show();	
	}else{
		$('#zoomBtn_'+counter).hide();
	}

	return counter;
	
}

function replacer(id){
	
			var height = '60';
			var value = $("#"+id+"_text").val();
			
			//var iframe = '<div class="absolute-content" onclick="zoomcontent('+id+')"></div><iframe class="iframe_style" id="vis_tool_iframe'+id+'" width="95%" height="'+height+'" src="http://roc.cs.rochester.edu/convInterface/videocoding/tools/vis_tools/?session='+value+'&details=false&embedded=true" frameborder="0"></iframe>';
			var iframe = '<div class="absolute-content"></div><iframe style="margin-left:7px;width: 99.9%" class="iframe_style" id="vis_tool_iframe'+id+'"  height="'+height+'" src="http://roc.cs.rochester.edu/convInterface/videocoding/tools/vis_tools/?session='+value+'&details=false&embedded=true" frameborder="0"></iframe>';
			$('#iframe_'+id).html(iframe);
			
			if($('#vis_tool_iframe'+id).length){
				$('#zoomBtn_'+id).show();	
			}else{
				$('#zoomBtn_'+id).hide();
			}
			
			return true;
		
}

function render_new(id,height){
	
	var value = $("#"+id+"_text").val();
	
	if(value == ''){
		return false;	
	}
	
	var iframe_id = "vis_tool_iframe"+id;
	
		if ($('#'+iframe_id).length) {
  		
			replacer(id);
				
		}else{
			
			replacer(id);
			
		}	
}

function add_values_to_bar(){
	
	var counter = $('#iframe_working').val();
	
	var height = '60';
	
	var value = $("#action").val();
	
	var iframe = '<iframe style="margin-left:7px;width: 99.9%" class="iframe_style" id="vis_tool_iframe'+counter+'" width="95%" height="'+height+'" src="http://roc.cs.rochester.edu/convInterface/videocoding/tools/vis_tools/?session='+value+'&details=false&embedded=true" frameborder="0"></iframe>';
	
	//var content =  '<li id="vbar_'+counter+'" class="thumbnail"><table width="99%" id="table_'+counter+'"><tr><td width="15%" align="center"><img class="icon-remove" src="images/remove_icon.png" onclick="remove_bar('+counter+')" />&nbsp&nbsp&nbsp&nbsp&nbsp<input class="left_text_width" align="center" id="'+counter+'_text" type="text" id="someid" value="'+value+'" /><input type="button" id="zoomBtn'+counter+'" value="&#x25BC;"/></td><td width="85%" align="center"><div class="absolute-content" onclick="zoomcontent('+counter+')"></div><span id="iframe_'+counter+'">'+iframe+'</span></td><td width="5%" align="center"><input type="button" onclick="render_new('+counter+',1)" class="btn btn-primary" value="Go" /><tr></table></li>';
	var content =  '<li id="vbar_'+counter+'" class="thumbnail"><table width="99%" id="table_'+counter+'"><tr><td width="15%" align="center"><img class="icon-remove" src="images/remove_icon.png" onclick="remove_bar('+counter+')" />&nbsp&nbsp&nbsp&nbsp&nbsp<input class="left_text_width" align="center" id="'+counter+'_text" onKeyUp="refersh_content('+counter+',event)" type="text" id="someid" value="'+value+'" /><input type="button" id="zoomBtn'+counter+'" value="&#x25BC;"/></td><td width="70%" align="center"><div class="absolute-content"></div><span id="iframe_'+counter+'">'+iframe+'</span></td><td width="15%" align="right"><input type="button" onclick="render_new('+counter+',1)" class="btn btn-primary" value="Go" id="go_'+counter+'" /><tr></table></li>';
	
	$('#'+counter).replaceWith(content);
	
	addBar();
	
	$('#zoomBtn_' + counter).click( function() {
		zoomcontent(counter);
	});
	
}

function refersh_content(id,e)
{
	
        if (typeof e == 'undefined' && window.event) { e = window.event; }
        if (e.keyCode == 13)
        {
			$('#go_'+id).click();	        
        }
	
}

function loadBarData(counter){
	if( $('#iframe_' + counter + ' .absolute-content').css('display') == 'none' ) {
		// alert(counter);
		var sessionName = $("#" + counter + "_text").val()
		$.ajax({
	        dataType: "json",
	        async: true,
	        url: "php/getDBRow.php",
	        data: {session: sessionName}, //uses session to get correct row
	        success: function(d) {
		        var dbRow = d;
		        $("#action").val(dbRow[0].action);
		        $("#description").val(dbRow[0].description);
		        $("#startTimeField").val(parseFloat(dbRow[0].initialStart));
		        $("#endTimeField").val(parseFloat(dbRow[0].initialEnd));

		        $("#newLabel :input").prop("disabled", true);

	        },
	        fail: function(){
	        	alert("Failed to get row from db");
	        }
	    });
	}
	else{
		$("#newLabel :input").prop("disabled", false);
		$("#action").val("");
		$("#description").val("");
		$("#startTimeField").val("");
		$("#endTimeField").val("");
	}
} 
 
//function addBar(){
//
//  for( i = 0; i < 1; i++ ) {
//    	//$("#slider-container").append("<div id='sliderbar-" + i + "' class='slider'><label for='amount" + i  + "'>Time range:</label> <input type='text' id='amount" + i + "' class='time-label' readonly='readonly'/><span id='sliderPurpose'>Select an example of the action to be found</span><button id='sliderPurposeButton' type='button'>Next</button><div id='slider-range" + i + "'></div></div>"); //appends first div to slider-container
//      $("#slider-container").append("<div id='sliderbar-" + i + "' class='slider'><label for='amount" + i  + "'>Time range:</label> <input type='text' id='amount" + i + "' class='time-label' readonly='readonly'/><span id='sliderPurpose'>Select an example of the action to be found</span><div id='slider-range" + i + "'></div></div>"); //appends first div to slider-container    	
//      //alert("(init) start:" + startTime + " --> " + startTime + ((endTime - startTime) * .25));
//    	//alert("(init) end:" + endTime + " --> " + (endTime - ((endTime - startTime) * .25)));
//    	$( "#slider-range" + i ).slider({
//      	range: true,
//      	min: startTime,
//      	max: endTime,
//      	step: 0.1,
//      	values: [ (startTime + (endTime - startTime) * .25), (endTime - ((endTime - startTime) * .25)) ],
//      	disabled: false,
//      	slide: function( event, ui ) {
//      		var clickedid = $(this).attr('id'); //retrieves ID currently being clicked
//      		var remove ='slider-range'; //removes 'slider-range' the common part of all bar ids
//      		var finalnumber = clickedid.replace(remove,''); //just gets the number of the id
//      		if((ui.values[1] - ui.values[0]) <= 1.6)
//  		{
//  			//alert("returning false -- too close?")
//  			return false;
//  		}
//          $( "#amount" + finalnumber ).val( ui.values[ 0 ] + "s - " + ui.values[ 1 ] +"s"); 
//        		   
//      	},
//      	stop: function(event, ui) {
//  	      var clickedid = $(this).attr('id');
//      		var remove ='slider-range';
//      		var finalnumber = clickedid.replace(remove,'');
//  	      val[(2*finalnumber)] = ui.values[0]; //fills array with values
//  	      val[(2*finalnumber)+1] = ui.values[1];
//  	      //alert("joined val first: " + val.join('\n'));
//      	}
//   	});           
//  //alert("range: " + $( "#slider-range" + i).slider( "values", 0 ) );
//  $( "#amount" + i ).val( $( "#slider-range" + i).slider( "values", 0 ) + "s - " + $( "#slider-range" + i).slider( "values", 1 ) +"s");
//
//  // WSL: Total and utter hack to get the 2nd slider value to be red
//  $('#slider-range'+i+' a')[1].style["background"] = "#A00";
//  $('#slider-range'+i+' a')[1].style["border-color"] = "#800";
//
//
//  }
//}
