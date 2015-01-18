var Clear = {

clearAll: function() {
    $.ajax({
        url: "php/clearSessions.php",
            type: "POST",
            dataType: "text",
            success: function(d) {
		alert("DB Cleared.");
            },
            fail: function(d) {
		alert("Clear failed!");
            }
    });
},


}

$(document).ready( function() {
    $('#clearButton').click( function () {
	Clear.clearAll();
    });
});

