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
    echo $session;
    $qry = $dbh->prepare("UPDATE sessions SET active = 0 WHERE session_id = :session");
    $qry->execute(array(":session"=>$session));
  }
    

?>