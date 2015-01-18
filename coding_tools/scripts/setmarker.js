			$(document).ready( function() {
			
					alert(currentTimeLeft);
					alert(currentTimeRight);
					$( "#slider-range" + activeBarID ).slider( "values", 0, currentTimeLeft );
					$( "#slider-range" + activeBarID  ).slider( "values", 1, currentTimeRight );
					var clickedid = $(this).attr('id');
				
					alert(clickedid); //where I left off. Trying to find the one bar enabled and set start and end to it when buttons are clicked

					$(clickedid).hover( function() {
						alert(clickedid);
						if(clickedid == "slider-range0")
							alert('fish');
						else
							alert('no fish');
						});
				
				});

			
				
