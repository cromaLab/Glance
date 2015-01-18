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
    //$sth = $dbh->prepare("SELECT * FROM setup WHERE session=:session AND clipIndex=:clipIndex");
    //$sth->execute(array(':session'=>$session, ':clipIndex'=>$clipIdx));
    $sth = $dbh->prepare("SELECT * FROM setup WHERE session=:session AND clipIndex > -1");
    $sth->execute(array(':session'=>$session));

    # Print out all of the start/end pairs
    $isFirst = true;
    while( $row = $sth->fetch(PDO::FETCH_ASSOC) ) {
        if( !$isFirst ) {
            echo(";");
        }
        else {
            $isFirst = false;
        }

        echo($row["start"] . "-" . $row["end"]);
    }

}
else {
	print("HANDLE ERROR!");

}

?>
