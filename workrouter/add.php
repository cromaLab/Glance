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
    $max = $_REQUEST["max"];

    $qry = $dbh->prepare("SELECT * FROM setup WHERE session=:session");
    $qry->execute(array(":session"=>$session));
    $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
    $result = $qryAry;
    
    for($i = 0; $i < sizeof($result); $i++){
      if($result[$i]['clipIndex'] != -1){
        $qry = $dbh->prepare("INSERT INTO sessions (session_name, active, max, session_id, clipIndex) values (:session_name, 1, :max, :session_id, :clipIndex)");
        $qry->execute(array(":session_name"=>$result[$i]['setupId'], ":max"=>$max, ":session_id"=>$session, ":clipIndex"=>$result[$i]['clipIndex']));
      }
    }
}

?>
