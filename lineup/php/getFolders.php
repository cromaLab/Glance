<?php
	
	chdir('../images');
	$session = $_REQUEST['session'];

	$regex = $session . "*";
	$folders = glob($regex);

	// print implode(",", $folders);
	print "dateNodBlurLevel10_mitchell";
?>