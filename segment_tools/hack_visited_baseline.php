<?php

// Adds entries to visited table.

include "../vis_tools/php/getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){

	for($i = 0; $i < 5; $i++){
		echo "success";
		$sth = $dbh->prepare("INSERT INTO visited (workerId, arrivalTime, submitTime, session, clipIndex, page) values (:workerId, now(), now(), :session, :clipIndex, 'coding')");
		$sth->execute(array(':workerId' => "bram", ":session" => "eyeContact1Baseline2", ":clipIndex" => $i));
	}

	echo "success";
}

?>

