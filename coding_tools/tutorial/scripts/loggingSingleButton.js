$(document).ready( function() {

	$("#legion-submit").unbind('click');

	var switchedOn = false;

	$('#myonoffswitch').click(function() {
		if(switchedOn == false){
			switchedOn = true;
			var tempTime = player.getCurrentTime();
			if(tempTime > 95.5 && tempTime < 97){
				//ajax call to tutorial log
				$.ajax({
					url: "php/checkTutorialNew.php",
					aync: false,
					data: {workerId: gup('workerId'), mode: gup("mode"), addWorkerToList: "true"},
					dataType: "text",
					success: function(d) {
						logId = d;
						alert("Correct, now sending you to the next page.");
						window.location = url;
					},
					failed: function(){alert('Logging failed');}
				});
				// alert("Correct, now sending you to the next page.");
				// window.location = url;
			}
			else{
				player.pauseVideo();
				setTimeout(function() { alert("Only click when you see the action occur"); }, 1);
				player.playVideo();
				// $('#myonoffswitch').click();
			}
		}
		else{
			switchedOn = false;
		}
	});

	$("#legion-submit").click(function() {
		// alert("Correct. Now forwarding you to the next page.");
		// window.location = url;
	});

});