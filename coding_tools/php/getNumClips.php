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
    $session = $_REQUEST["session"];

    $qry = $dbh->prepare("SELECT * FROM setup WHERE session=:session and clipIndex >= 0");
    $qry->execute(array(":session"=>$session));
    $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
    $result = $qryAry;
    echo sizeof($result);
}

?>
