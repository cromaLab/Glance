<?php
$videoId = $_REQUEST['videoId'];
$start = $_REQUEST['start'];
$end = $_REQUEST['end'];
$action = $_REQUEST['action'];
$description = $_REQUEST['description'];
$session = $_REQUEST['session'];
$trial = $_REQUEST['trial'];
$clipIndex = $_REQUEST['clipIndex'];
$mturk = $_REQUEST['mturk'];
$clipLength = $_REQUEST['clipLength'];
$initialStart = $_REQUEST['initialStart'];
$initialEnd = $_REQUEST['initialEnd'];

if(isset($_REQUEST['clipStart']) && isset($_REQUEST['clipEnd'])) { //these refer to the example clip, not the clip index clip
	$clipStart = $_REQUEST['clipStart'];
	$clipEnd = $_REQUEST['clipEnd'];
}
else {
	$clipStart = 0;
	$clipEnd = 0;
}


include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){
	$data = array( 'videoId' => $videoId, 'start' => $start, 'end' => $end, 'action' => $action, 'description' => $description, 'session' => $session, 'clipStart' => $clipStart, 'clipEnd' => $clipEnd, 'trial' => $trial, 'clipIndex' => $clipIndex, 'mturk' => $mturk, 'clipLength' => $clipLength, 'initialStart' => $initialStart, 'initialEnd' => $initialEnd);
	$sth = $dbh->prepare("INSERT INTO setup (videoId, start, end, clipStart, clipEnd, action, description, session, trial, clipIndex, mturk, clipLength, initialStart, initialEnd) value (:videoId, :start, :end, :clipStart, :clipEnd, :action, :description, :session, :trial, :clipIndex, :mturk, :clipLength, :initialStart, :initialEnd)");
	$sth->execute($data);

	echo $dbh->lastInsertId('setupId');  
}

?>