<?php

include "getDB.php";


if(isset($_REQUEST['worker']) && isset($_REQUEST['session'])){
$worker = $_REQUEST['worker'];
//$time = $_REQUEST['time'];
$session = $_REQUEST['session'];
$confidence = $_REQUEST['confidence'];
$clipIndex = $_REQUEST['clipIndex'];


try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}
	
# Post the segmentations to the DB -- NOTE: Assumes unique session/workerID pairs
if($dbh) {
	$sth = $dbh->prepare("SELECT COUNT(*) AS count FROM segments WHERE session=:session AND author=:worker");
    $sth->execute(array(':session'=>$session, ':author'=>$worker));
	$row = $sth->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
	$count = $row['count'];

	if( isset($_REQUEST['intime']) && isset($_REQUEST['outtime']) ){
		$intime = floatval($_REQUEST['intime']);
		$outtime = floatval($_REQUEST['outtime']);

		// echo $session . ".";
		// echo $intime . ", ";
		// echo $outtime . ", ";
		// echo $worker . ", ";


		$sth = $dbh->prepare("INSERT INTO segments (session, startsegment, endsegment, author, confidence, clipIndex) VALUES (:session, :intime, :outtime, :worker, :confidence, :clipIndex)");
	    $sth->execute(array(':session'=>$session, ':intime'=>$intime, ':outtime'=>$outtime, ':worker'=>$worker, ':confidence'=>$confidence, ':clipIndex'=>$clipIndex));

	    echo $dbh->lastInsertId();
	}
	else {
		print("TIME NOT SET");
	}
}
else {
	print("HANDLE ERROR!");

}

}
?>
