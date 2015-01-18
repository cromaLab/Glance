<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('../../../getDB.php');

  try {
      $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
      echo $e->getMessage();
  }


if( $dbh ) {
    $cqry = $dbh->prepare("SELECT COUNT(*) FROM sessions WHERE active=true");
    $cqry->execute();

    $cary = $cqry->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
    $count = intval($cary['COUNT(*)']);

    if( $count > 0 ) {
        // Select a random session
        $sqry = $dbh->prepare("SELECT session_name FROM sessions WHERE active=true ORDER BY RAND() LIMIT 1");
        $sqry->execute();
        $sarray = $sqry->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
        $session = $sarray["session_name"];

        print $session;
    }
    else {
        print "none";
    }
}

?>
