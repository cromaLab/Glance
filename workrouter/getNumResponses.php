<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('php/getDB.php');

  try {
      $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
      echo $e->getMessage();
  }


if( $dbh ) {
    $session = $_REQUEST["session"];
    $clipIndex = $_REQUEST['clipIndex'];

    $qry = $dbh->prepare("SELECT * FROM segments WHERE session=:session AND clipIndex=:clipIndex GROUP BY author");
    $qry->execute(array(":session"=>$session, ":clipIndex"=>$clipIndex));
    $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
    $result = $qryAry;
    echo sizeof($result);
}

?>
