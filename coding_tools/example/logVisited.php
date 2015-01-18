<?php
$workerId = $_REQUEST['workerId'];
$page = $_REQUEST['page'];


include "../php/getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){
	$data = array( 'workerId' => $workerId, 'page' => $page);
	$sth = $dbh->prepare("INSERT INTO visited (workerId, page) value (:workerId, :page)");
	$sth->execute($data);  
}

?>