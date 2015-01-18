<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('../../../getDB.php');



  try {
      $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
      echo $e->getMessage();
  }


if( $dbh ) {
    $session = $_REQUEST["session"];
    $setting = $_REQUEST["setting"];
    if(strcmp($setting,"true")==0 || strcmp($setting, "1")==0){
       $setting = true;
    }
    else if(strcmp($setting,"false")==0 || strcmp($setting,"0")==0){
      $setting = false;
    }
    echo $session . " | " . $setting;

    $qry = $dbh->prepare("UPDATE sessions SET active=:setting WHERE session_name=:session");
    $qry->execute(array(":session"=>$session, ":setting"=>$setting));
    $qryAry = $qry->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
    $result = $qryAry['update'];
echo $result;


    $junk = $dbh->prepare("SELECT active FROM sessions WHERE session_name=:session");
    $junk->execute(array(":session"=>$session));

    $junkAry = $junk->fetch(PDO::FETCH_ASSOC, PDO::FETCH_ORI_NEXT);
    $junkOut = $junkAry['active'];
    //$junkOut = $junkAry['database()'];

    echo "::|" . $junkOut . "|::";

    echo "\nDone.";
}

?>
