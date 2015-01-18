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
    $workerId = $_REQUEST["workerId"];

    $qry = $dbh->prepare("SELECT * FROM segments WHERE author=:workerId");
    $qry->execute(array(":workerId"=>$workerId));
    $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
    $result = $qryAry;
    echo sizeof($result);
}

?>
