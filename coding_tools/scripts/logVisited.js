var sessionToLog;
var clipIndexToLog;

$(document).ready( function() {
	$.ajax({
        dataType: "json",
        async: false,
        url: "php/getDBRow.php",
        data: {setupId: gup("setupId")}, //uses setupId to get correct row
        success: function(d) {
         row = d;
         sessionToLog = row[0].session;
         clipIndexToLog = row[0].clipIndex;
         //alert(sessionToLog);
        },
        fail: function(){
          alert("Failed to get row from db");
        }
      });

	log();

});

var logId;

function log() {	
	var currentPage;
	// if(location.pathname.substring(1) == "convInterface/videocoding/tools/coding_tools/index.html") currentPage = "coding";
	// alert(gup('mode'));
	if(whatPageIsThis == "coding") currentPage = "coding";
	else currentPage = location.pathname.substring(1);

	$.ajax({
		url: "php/logVisited.php",
		aync: false,
		data: {workerId: gup('workerId'), page: currentPage, session: sessionToLog, clipIndex: clipIndexToLog, mode: gup('mode')},
		dataType: "text",
		success: function(d) {
			logId = d;
			// alert("success")
		},
		failed: function(){alert('Logging failed');}
	});
		
	
}

//updates submit time
function logSubmitTime(){
	// alert(logId);
	$.ajax({
		url: "php/logVisited.php",
		aync: false,
		data: {id: logId, mode: gup('mode')},
		dataType: "text",
		success: function() {
		},
		failed: function(){alert('Logging failed');}
	});
		
	
}

