<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('getDB.php');

if( isset($_REQUEST['workerId'])) {

  try {
    $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
    echo $e->getMessage();
  }

  if( $dbh ) {


    $workerId = $_REQUEST['workerId'];

    $found = false;
    $session = "";
    $group = "";

    // If the worker already coded a video, find the group that it belonged to
    $sqry = $dbh->prepare("SELECT * FROM visited WHERE page='coding' AND workerId = :workerId");
    $sqry->execute(array(":workerId" => $workerId));
    $checkThese = $sqry->fetchAll();
    for($i = 0; $i < sizeof($checkThese) && $found == false; $i++){
      $sqry = $dbh->prepare("SELECT * FROM sessions WHERE session = :session");
      $sqry->execute(array(":session" => $checkThese[$i]['session']));
      $result = $sqry->fetchAll();

      if(sizeof($result) > 0){
        $group = $result[0]["group"];
        if($group != null && $group != ""){
          $found = true;
        }
      }
    }

    // Get list of sessions that can be used for worker
    if($group != null && $group != ""){
      $sqry = $dbh->prepare("SELECT * FROM sessions WHERE active=true AND group=:group ORDER BY routed_count ASC");
      $sqry->execute(array(":group"=>$group));
      $sarray = $sqry->fetchAll();
    }
    else{
      $sqry = $dbh->prepare("SELECT * FROM sessions WHERE active=true ORDER BY routed_count ASC");
      $sqry->execute();
      $sarray = $sqry->fetchAll();
    }

    $found = false;

    // Cycle through all allowable sessions
    for($i = 0; $i < sizeof($sarray) && $found == false; $i++){

      // Check if worker has already done this clip
      $sqry = $dbh->prepare("SELECT COUNT(*) FROM visited WHERE session = :session AND clipIndex = :clipIndex AND workerId = :workerId");
      $sqry->execute(array(":session" => $sarray[$i]["session_id"], ":clipIndex" => $sarray[$i]["clipIndex"], ":workerId" => $workerId));
      $rows = $sqry->fetch(PDO::FETCH_NUM);
      $numFound = $rows[0];

      if($numFound == 0){
        $found = true;
        $session = $sarray[$i]["session_name"];

        if( isset($_REQUEST['willCode'])) {
          $sqry = $dbh->prepare("UPDATE sessions SET routed_count = routed_count + 1 WHERE session_name = :session");
          $sqry->execute(array(":session" => $session));
        }

        echo $session;
        return;

      }

    }

    //If there are no tasks for the worker to do
    if($found == false) echo 1;
  }
}
else {
    print("FAILING");
}
?>

