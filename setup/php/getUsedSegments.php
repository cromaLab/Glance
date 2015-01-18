<?php
$session = $_REQUEST['session'];

include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){

	$stmt = $dbh->prepare("SELECT * FROM segments WHERE session=?");
	$stmt->execute(array($session));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($rows);
}

?>