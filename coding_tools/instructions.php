<!DOCTYPE html>
<html>
<head>
<title>Instructions</title>
<script src="scripts/gup.js"></script>
<script src="https://code.jquery.com/jquery-1.9.1.js"></script>
<link rel="stylesheet" href="css/bar.css" />
<!-- <script src="logVisited.js"></script> -->
</head>

<script>

$(document).ready(function(){
    $.ajax({
        url: "../workrouter/php/getActiveSession.php",
        type: "POST",
        dataType: "text",
        async: false,
        data: {workerId: gup('workerId')},
        success: function(d) {
			// alert(gup('workerId'));
			console.log(d);
			if(d == 1) {
				// alert("go away");
				$("body").html("<h2>Sorry, no more tasks are available at this time.</h2>");
			}
			else {
				// alert("what");
	  			if(gup('workerId') == "") alert("Remember to accept the HIT before continuing!");

			  	var url;
			  	var mode = gup("mode");
			  	$.ajax({
			        url: "php/checkTutorialNew.php",
			        type: "POST",
			        async: false,
			        dataType: "text",
			        data: {workerId: gup('workerId'), mode: mode},
			        success: function(d) {
						// If they have already done the tutorial
						if( parseFloat(d) > 0 ) {
							url = "https://roc.cs.rochester.edu/convInterface/videocoding/tools/workrouter/index.php?";
						}
						else {
							if(gup("mode") == "rabbit"){
								url = "tutorial/tutorialSingle.php?";
							}
							else{
								url = "tutorial/tutorial.php?";
							}
						}
					}
				});

				if(url == "") url = "tutorial/tutorial.php?";

				if(gup("mode") == "justVideo") 	url = "https://roc.cs.rochester.edu/convInterface/videocoding/tools/workrouter/index.php?";

				// url += "?setupId=" + gup("setupId");
				url += "turkSubmitTo=" + gup("turkSubmitTo");
				url += "&workerId=" + gup("workerId");
				url += "&assignmentId=" + gup("assignmentId");
				url += "&hitId=" + gup("hitId");
				url += "&mode=" + gup("mode");
				url += "&lineup=" + gup("lineup");
				// url += "&useRetainer=" + gup("useRetainer");

				//waits 6 seconds before enabling continue button
				if(!(gup('assignmentId') == 'ASSIGNMENT_ID_NOT_AVAILABLE')){
					$("#continue").attr('value', 'TRY AN EXAMPLE / CONTINUE');
					$("#continue").removeAttr('disabled');
					// $(".instructions").hide();
					// var buttonInterval = setInterval(function(){
					// 	$("#continue").removeAttr('disabled');		
					// 	$("#continue").attr('value', 'Continue');
					// 	window.clearInterval(buttonInterval);

					// },6000);
				}

				$("#continue").on("click", function(event){
					event.preventDefault();
					// alert(url);
					window.location = url;
				});
			}
		}
	});
});

</script>

<style>
	li {
		padding-bottom: 5px;
	}
</style>

<body>
	<h2 class="instructions" style="margin-left:25px"><u>Instructions</u></h2>
	<ul class="instructions">
   		<!-- <li> Mark if you the given event in a video. </li> -->
		<!-- <li> PLEASE NOTE: The following page contains a tutorial which will train you to complete our task. After completiting the tutorial, you will be forwarded to the task. You will only need to complete this once.</li> -->
   		<!-- <li> If there is more than one event in the video, use different bars to mark each one. </li> -->
		<!-- <li> New bars will appear once you finish marking the current event and press the <strong> DONE </strong> button. </li> -->
   		<!-- <li> You can rewind at any time to re-watch for events. </li> -->
   		<!-- <li> Once finished marking ALL events in the video, hit the <strong> SUBMIT </strong> button. </li> -->
   		<!-- <li> If there are no events at all, hit <strong> SUBMIT </strong> once the video is finished. </li>  -->
   		<!-- <li> The HIT will be evaluated based on completion and accuracy. </li> -->
   		<!-- <li> Thanks! </li> -->
   	</ul>
<br/>
<iframe width="640" height="480" src="//www.youtube.com/embed/rgtUehl9rOw" frameborder="0"></iframe>
<br/>
<br/>


<form action="tutorial/tutorial.php">
    <input id="continue" type="submit" value="PLEASE ACCEPT THE HIT" style="margin-left:100px;font-size:100px;" disabled="disabled">
</form>

<style>
html,body {
	font-family: verdana, sans serif;
	font-size: 0.9em;
	height: 100%;
}
.container {
	height: 70%;
	overflow: scroll;	
	border: 3px solid #aaa;
}
.container,.consent {
	width: 60%;
	margin: auto;
	padding: 5px;
}
input[type=submit],input[type=checkbox] {
	line-height: 2.5em;
	font-size: 3.5em;
	font-weight: bold;
}
</style>
<?php
//echo "PASS" . $passthru . " -- " . $r . "\n";
?>
<p class="consent" style="padding: 2em 0">
Please read the information below. You will only need to do this step once for all of our tasks.
</p>
<div class="container">
<h1>Coding Video</h1>

<p>
This task is part of a research study conducted by Jeffrey Bigham at Carnegie Mellon University and is funded by Carnegie Mellon University.
</p>

<p>
The purpose of the research is to understand how small bits of human work may be able to allow computers to perform tasks that they cannot do currently, e.g. reliably convert speech to text, understand the visual information in images, or respond naturally to natural language questions.
</p>


<h2>Procedures</h2>
<p>
If you participate, you will be asked to complete or simply view one or more interaction tasks, which may involve entering a text description (e.g., describing an image or sound), controlling an interface (e.g., clicking buttons, navigating an avatar to a specified target), or typing responses to provided questions (e.g., answering, "what is a good restaurant in Pittsburgh?"). The duration of these tasks will be at least one minute and no more than one hour. You may quit after any task and be compensated proportional to the time spent.
</p>


<h2>Participant Requirements</h2>
<p>
Participation in this study is limited to individuals aged 18 and older.
</p>

<h2>Risks</h2>
<p>
The risks and discomfort associated with participation in this study are no greater than those ordinarily encountered in daily life or during other online activities. As with other tasks in your daily life, you may tire or become bored completing our tasks. There is also a risk of confidentiality being breached.
</p>

<h2>Benefits</h2>
<p>
There may be no personal benefit from your participation in the study but the knowledge received may be of value to humanity.
</p>

<h2>Compensation &amp; Costs</h2>
<p>
You will be compensated for your participation in this study at the rate of $10 per hour. There will be no cost to you if you participate in this study. If you decide to end the Study early, you will be compensated for the portion that you completed.
</p>

<h2>Confidentiality</h2>
<p>
The data captured for the research does not include any personally identifiable information about you.  Your IP address will not be captured.
</p>

<h2>Right to Ask Questions &amp; Contact Information</h2>
<p>
If you have any questions about this study, you should feel free to ask them by contacting the Principal Investigator now at Jeffrey P. Bigham, Human-Computer Interaction Institute, 5000 Forbes Ave, Pittsburgh, PA 15213. (412) 945-0708, jbigham@cs.cmu.edu. If you have questions later, desire additional information, or wish to withdraw your participation please contact the Principal Investigator by mail, phone or e-mail in accordance with the contact information listed above.  
</p>

<p>
If you have questions pertaining to your rights as a research participant; or to report objections to this study, you should contact the Office of Research integrity and Compliance at Carnegie Mellon University.  Email: irb-review@andrew.cmu.edu . Phone: 412-268-1901 or 412-268-5460.
</p>

<h3>Voluntary Participation</h3>
<p>
Your participation in this research is voluntary.  You may discontinue participation at any time during the research activity.  
</p>
</div>
<div class="consent" style="background-color: #EEE">

</div>
</body>

</html>
