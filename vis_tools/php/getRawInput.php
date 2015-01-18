<?php

include "getDB.php";


$session = $_REQUEST['session'];
$clipIdx = $_REQUEST['clipIndex'];

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}
	
if($dbh) {
    # Get all of the clip setup information from the DB
    $sth = $dbh->prepare("SELECT * FROM segments WHERE session=:session AND clipIndex=:clipIdx ORDER BY author ASC");
    $sth->execute(array(':session'=>$session, ':clipIdx'=>$clipIdx));

    # Get all of the clip setup information from the DB
    $sth2 = $dbh->prepare("SELECT COUNT(*) AS num FROM visited WHERE page='coding' AND session=:session AND clipIndex=:clipIdx AND submitTime > 0");
    $sth2->execute(array(':session'=>$session, ':clipIdx'=>$clipIdx));

    $wTemp = $sth2->fetch(PDO::FETCH_ASSOC);
    $workerCount = $wTemp["num"];



    echo($clipIdx . "," . $workerCount . "=");
    # Print out all of the start/end pairs
    $isFirst = true;
    while( $row = $sth->fetch(PDO::FETCH_ASSOC) ) {
        # Check for the start of a new author's input
        if( $row["author"] <> $prevAuth ) {
            if( !$isFirst ) {
              echo("|");
            }
            echo($row["author"] . ":");
            $prevAuth = $row["author"];
        }
        else {
            echo(";");
        }
        echo($row["startsegment"] . "-" . $row["endsegment"]);

        $isFirst = false;
    }

}
else {
	print("HANDLE ERROR!");

}

?>
