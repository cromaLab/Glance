<?php
$session = $_REQUEST['session'];
$setupId = $_REQUEST['setupId'];
$clipIndex = $_REQUEST['clipIndex'];
$max = $_REQUEST['max'];

include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){

	$stmt = $dbh->prepare("INSERT INTO sessions (session_name, session_id, active, max, clipIndex) values (:session_name, :session_id, :active, :max, :clipIndex)");
	$stmt->execute(array(":session_name" => $setupId, ":session_id" => $session, ":active" => 1, ":max" => $max, ":clipIndex" => $clipIndex));
}

?>