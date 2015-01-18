$(document).ready(function() {
			$("#instructions_section").click(function(){
				$('.content').slideToggle('slow', function(){
					if($('.content').is(":hidden"))
				{
	    		var str = "Click to show instructions!";
	    		$('#instruction_link').html(str);
				}
				else
				{
				var str = "Click to hide instructions!";
    			$('#instruction_link').html(str);
				}
				});
			
			});
});
