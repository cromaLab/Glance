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
    $mode = $_REQUEST["mode"];

    if(isset($_REQUEST["addWorkerToList"])){
      if($_REQUEST["addWorkerToList"] == "true") {
        $mode = $_REQUEST["mode"];
        $qry = $dbh->prepare("INSERT INTO tutorialLog (workerId, mode) VALUES (:workerId, :mode)");
        $qry->execute(array(":workerId"=>$workerId, ":mode"=>$mode));
      }
    }

    else{
      $qry = $dbh->prepare("SELECT * FROM tutorialLog WHERE workerId=:workerId AND mode=:mode");
      $qry->execute(array(":workerId"=>$workerId, ":mode"=>$mode));
      $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
      $result = $qryAry;
      echo sizeof($result);
    }
}

?>
