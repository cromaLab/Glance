var sessionToLog;
var clipIndexToLog;

$(document).ready( function() {
	
	// $.ajax({
 //        dataType: "json",
 //        async: false,
 //        url: "php/getDBRow.php",
 //        data: {setupId: gup("setupId")}, //uses setupId to get correct row
 //        success: function(d) {
 //         row = d;
 //         sessionToLog = row[0].session;
 //         clipIndexToLog = row[0].clipIndex;
 //         alert(sessionToLog);
 //        },
 //        fail: function(){
 //          alert("Failed to get row from db");
 //        }
 //      });

	log();

});

var logId;

function log() {	
	$.ajax({
		url: "php/logVisited.php",
		aync: false,
		data: {workerId: gup('workerId'), page: location.pathname.substring(1), session: sessionToLog, clipIndex: clipIndexToLog},
		dataType: "text",
		success: function(d) {
			logId = d;
		},
		failed: function(){alert('Logging failed');}
	});
		
	
}

//updates submit time
function logSubmitTime(){

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

