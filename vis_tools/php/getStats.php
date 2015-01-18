<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

header('Content-type: application/json');

# PARAMS
//$findSegName = 'findSegments_simpleRules.rb';
$findSegName = 'findSegments_scanning.rb';


# ARGS
$session = $_REQUEST['session'];
if( isset($_REQUEST['findSegTool']) ) {
	$findSegName = $_REQUEST['findSegTool'];
}
if( isset($_REQUEST['type']) ) {
	$type = $_REQUEST['type'];
}

# Run the segmentation merge code (find segment)
#echo("Running with " . $session . ' ' . $idx);
chdir("../../segment_tools/");
$execOut = exec("ruby apiResults.rb " . $session . " " . $findSegName . " " . $type . " " . " 2> errlog_stats.txt");
#echo("ruby apiResults.rb " . $session . " " . $findSegName . " " . $type . " " . " 2> errlog_stats.txt");
# Print to return the results
echo $execOut;
?>
