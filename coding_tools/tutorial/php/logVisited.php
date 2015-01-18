<?php

include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){
	// echo "here";

	if(isset($_REQUEST['workerId']) && isset($_REQUEST['page'])){
		$workerId = $_REQUEST['workerId'];
		$page = $_REQUEST['page'];
		$session = $_REQUEST['session'];
		$clipIndex = $_REQUEST['clipIndex'];
		
		$data = array( 'workerId' => $workerId, 'page' => $page, 'clipIndex' => $clipIndex, 'session' => $session);
		$sth = $dbh->prepare("INSERT INTO visited (workerId, page, arrivalTime, clipIndex, session) value (:workerId, :page, now(), :clipIndex, :session)");
		$sth->execute($data);  
		echo $dbh->lastInsertId('id');  
	}

	else if (isset($_REQUEST['id'])){
		$id = $_REQUEST['id'];

		$sth = $dbh->prepare("UPDATE visited SET arrivalTime = arrivalTime, submitTime = now() WHERE id=?;");
		$sth->execute(array($id));  

	}

}

?>