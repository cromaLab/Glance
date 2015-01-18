<?php

include "getDB.php";


$session = $_REQUEST['session'];
$clipIndex = $_REQUEST['clipIndex'];

try {
	$dbh = getDatabaseHandle();
} catch(PDOException $e) {
	echo $e->getMessage();
}
	
if($dbh) {
	$sth = $dbh->prepare("SELECT * FROM setup WHERE session=:session AND clipIndex=:clipIndex");
    $sth->execute(array(':session'=>$session, ':clipIndex'=>$clipIndex));
    $results = $sth->fetchAll(PDO::FETCH_ASSOC);
    // print_r($results);
    header( 'Location: http://roc.cs.rochester.edu/convInterface/videocoding/index.html?setupId=' . $results[0]['setupId'] ) ;

}
else {
	print("HANDLE ERROR!");

}

?>
