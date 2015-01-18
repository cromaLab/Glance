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

    $sqry = $dbh->prepare("SELECT * FROM sessions WHERE active=true ORDER BY routed_count ASC");
    $sqry->execute();
    $sarray = $sqry->fetchAll();
    // print_r($sarray);

    for($i = 0; $i < sizeof($sarray) && $found == false; $i++){

      // Check if worker has already done
      $sqry = $dbh->prepare("SELECT COUNT(*) FROM visited WHERE session = :session AND clipIndex = :clipIndex AND workerId = :workerId");
      $sqry->execute(array(":session" => $sarray[$i]["session_id"], ":clipIndex" => $sarray[$i]["clipIndex"], ":workerId" => $workerId));
      $rows = $sqry->fetch(PDO::FETCH_NUM);
      $numFound = $rows[0];
      // echo $numFound;

      if($numFound == 0){
        $found = true;
        $session = $sarray[$i]["session_name"];

        print $session;

      }

    }

    if($found == false) print "none";
  }
}
else {
    print("FAILING");
}
?>
