<?php

include "getDB.php";

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}

if($dbh){
	
	//print the most recent percent found for that session
	$session = $_REQUEST['session'];
	$sth = $dbh->prepare("SELECT * FROM percentSampled WHERE session=? ORDER BY ID DESC LIMIT 1");
	$sth->execute(array($session));
	$rows = $sth->fetchAll(PDO::FETCH_ASSOC);
	if ( $rows[0]['percent'] != "") $currentPercent = $rows[0]['percent'];
	else $currentPercent = 0;

	echo $currentPercent; //print current percent

	//add row with new percent if a percent to add is present and the new percent is greater than the old percent
	if(isset($_REQUEST['percent']) && ($currentPercent > $rows[0]['percent'] || $currentPercent == 0)){
		$percent = $_REQUEST['percent'] + $currentPercent;
		$session = $_REQUEST['session'];
		$data = array( 'session' => $session, 'percent' => $percent);
		$sth = $dbh->prepare("INSERT INTO percentSampled (session, percent) value (:session, :percent)");
		$sth->execute($data);
	}

}

?>