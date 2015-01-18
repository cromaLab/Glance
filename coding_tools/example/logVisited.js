$(document).ready( function() {
	log();

});


function log() {	
	//alert("Sending :: " + val[i+1]);
	//alert("Logging your results.");
	$.ajax({
		url: "logVisited.php",
		aync: false,
		data: {workerId: gup('workerId'), page: location.pathname.substring(1)},
		dataType: "text",
		success: function() {},
		failed: function(){alert('Logging failed');}
	});
		
	
}
