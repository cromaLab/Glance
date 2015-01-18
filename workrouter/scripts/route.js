var Router = {

session: null,
role: null,
workerId: null,
assignmentId: gup("assignmentId"),
// useVideo: gup("novid") ? gup("novid") : null,

init: function() {
    if( Router.assignmentId != "ASSIGNMENT_ID_NOT_AVAILABLE" ) {

    $.ajax({
        url: "php/getActiveSession.php",
        type: "POST",
        data: {workerId: gup("workerId"), willCode: "true"},
        dataType: "text",
        success: function(d) {
            // alert(d);
            if( d != 1 ) {
                Router.session = d

                if(gup('mode') == "justVideo"){
                    var url = "../coding_tools/justVideo.php?setupId=" + Router.session;
                }
                else var url = "../coding_tools/example/example.php?setupId=" + Router.session;
        		url += "&workerId=" + gup('workerId');
        		url += "&assignmentId=" + gup('assignmentId');
        		url += "&hitId=" + gup('hitId');
        		url += "&turkSubmitTo=" + gup('turkSubmitTo');
                url += "&mode=" + gup('mode');
                url += "&lineup=" + gup('lineup');
        		// url += "&task=" + Router.session;
        		// url += "&min=" + gup('min');

                    // if( Router.useVideo != null ) {
                    //     url += "&novid=true"
                    // }

                window.location = url;
            }
            else {
                $("body").html("<h2>Sorry, no more tasks are available at this time.</h2>");

                // alert("Sorry, there is no job available because no requester is currently asking questions. Please click 'Return HIT' and we hope you will accept jobs from us next time.")

      //       var url = "https://roc.cs.rochester.edu/LegionJS/LegionTools/Retainer/submitOnly.php?"

    		// url += "&workerId=" + gup('workerId');
    		// url += "&assignmentId=" + gup('assignmentId');
    		// url += "&hitId=" + gup('hitId');
    		// url += "&turkSubmitTo=" + gup('turkSubmitTo');
    		// url += "&task=" + Router.session;
    		// url += "&min=" + gup('min');
    		// window.location = url;
            }
        }
    });
    }
},


}

$(document).ready( function() {
    Router.init();
});

