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
    $session_name = $_REQUEST['setupId'];

    $sqry = $dbh->prepare("SELECT * FROM sessions WHERE session_name = :session_name");
    $sqry->execute(array(':session_name'=>$session_name));
    $sarray = $sqry->fetch(PDO::FETCH_ASSOC);
    echo $sarray['finished_count'];

    if($sarray['finished_count'] + 1 >= $sarray['max']){
      $sqry = $dbh->prepare("UPDATE sessions SET active = 0, time=now() WHERE session_name = :setupId");
      $sqry->execute(array(':setupId'=>$session_name));
    }

    $sqry = $dbh->prepare("UPDATE sessions SET finished_count = finished_count + 1 WHERE session_name = :setupId");
    $sqry->execute(array(':setupId'=>$session_name));

}

?>
