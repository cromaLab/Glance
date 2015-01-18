<?php

include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){

	if(isset($_REQUEST['workerId']) && isset($_REQUEST['page'])){
		$workerId = $_REQUEST['workerId'];
		$page = $_REQUEST['page'];
		$session = $_REQUEST['session'];
		$clipIndex = $_REQUEST['clipIndex'];

		$data = array( 'workerId' => $workerId, 'page' => $page, 'clipIndex' => $clipIndex, 'session' => $session, 'time' => microtime(true));
		$sth = $dbh->prepare("INSERT INTO visited (workerId, page, arrivalTime, clipIndex, session) value (:workerId, :page, :time, :clipIndex, :session)");
		$sth->execute($data);  
		echo $dbh->lastInsertId('id');  
	}

	else if (isset($_REQUEST['id']) && isset($_REQUEST['firstTimeSawIt'])){
		echo "here";
		$id = $_REQUEST['id'];
		if($_REQUEST['firstTimeSawIt'] == "true"){
			$sth = $dbh->prepare("UPDATE visited SET arrivalTime = arrivalTime, submitTime = submitTime, firstSaw = :time WHERE id = :id;");
			$sth->execute(array(":id" => $id, ":time" => microtime(true)));  
		}
	}

	else if (isset($_REQUEST['id'])){
		$id = $_REQUEST['id'];

		$sth = $dbh->prepare("UPDATE visited SET arrivalTime = arrivalTime, submitTime = :time WHERE id= :id;");
		$sth->execute(array(":id" => $id, ":time" => microtime(true)));  

	}

}

?>