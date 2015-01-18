<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

# PARAMS
//$findSegName = 'findSegments_simpleRules.rb';
$findSegName = 'findSegments_scanning.rb';


# ARGS
$session = $_REQUEST['session'];
$clipIdx = $_REQUEST['clipIndex'];
$suffix = '';
if( isset($_REQUEST['suffix']) ) {
  $suffix = $_REQUEST['suffix'];
}
if( isset($_REQUEST['findSegTool']) ) {
	$findSegName = $_REQUEST['findSegTool'];
}
$type = '';
if( isset($_REQUEST['type']) ) {
	$type = $_REQUEST['type'];
}


# Run the segmentation merge code (find segment)
#echo("Running with " . $session . ' ' . $idx);
chdir("../../segment_tools/");
$execOut = exec("ruby " . $findSegName . " " . $session . $suffix . " " . $clipIdx . " " . $type . " 2> errlog.txt");

# Print to return the results
echo $clipIdx . "=" . $execOut;
?>
