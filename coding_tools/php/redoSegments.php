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
    $clipIndex = $_REQUEST["clipIndex"];

    // $newSession = $_REQUEST["newSession"];

    $qry = $dbh->prepare("delete from segments where session=:session and clipIndex = :clipIndex");
    $qry->execute(array(":session"=>$session, ":clipIndex"=>$clipIndex));

    $qry = $dbh->prepare("select * from setup where session=:session and clipIndex = :clipIndex");
    $qry->execute(array(":session"=>$session, ":clipIndex"=>$clipIndex));
    $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);
    echo $qryAry[0]['setupId'];


    // $result = $qryAry;
    // echo sizeof($result);
}

?>



<!-- CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM table WHERE primarykey = 1;
UPDATE tmptable_1 SET primarykey = NULL;
INSERT INTO table SELECT * FROM tmptable_1;
DROP TEMPORARY TABLE IF EXISTS tmptable_1; -->