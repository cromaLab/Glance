<?php
	
	chdir('..');
	$folder = 'images/' . $_REQUEST['session'];

	// Get all images in dir
	$images = glob($folder . "/*.*");
	shuffle($images);

	$randomImages = array();
	for ($i = 0; $i < min(6, count($images)); $i++) {
		$randomImages[] = $images[$i];
	}

	$js_array = json_encode($randomImages);
	echo $js_array;

?>