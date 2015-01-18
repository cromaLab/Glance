<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('getDB.php');



  try {
      $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
      echo $e->getMessage();
  }


if( $dbh ) {
    $junk = $dbh->prepare("DELETE FROM sessions");
    $junk->execute();

    $junk = $dbh->prepare("DELETE FROM tokens");
    $junk->execute();

    echo "\nDone.";
}

?>
