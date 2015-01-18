<?php

include "getDB.php";


if(isset($_REQUEST['session'])){
$session = $_REQUEST['session'];

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}
	
# Post the segmentations to the DB -- NOTE: Assumes unique session/workerID pairs
if($dbh) {
	$sth = $dbh->prepare("SELECT * FROM segments WHERE session=:session");
        $sth->execute(array(':session'=>$session));

	print("ENTRY: " . "AUTHOR | START TIME | END TIME | SESSION</p> <HR/><BR/>");
	while( $row = $sth->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT) ) {
		print("<p><b>ENTRY:</b> " . $row['author'] . " | " . $row['startsegment'] . " | " . $row['endsegment'] . "</p>");
	}
}
else {
	print("HANDLE ERROR!");

}

}
?>
