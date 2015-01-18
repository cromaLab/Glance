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
    //$newSession = "eyeContact2Baseline2";
    $newSession = $session . "Baseline2";

    $qry = $dbh->prepare("CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM segments WHERE session=:session"); // AND clipIndex >= 25 AND clipIndex <= 29");
    $qry->execute(array(":session"=>$session));
    // $qryAry = $qry->fetchAll(PDO::FETCH_ASSOC);

    $qry = $dbh->prepare("UPDATE tmptable_1 SET id = NULL");
    $qry->execute();

    $qry = $dbh->prepare("UPDATE tmptable_1 SET session = :newSession");
    $qry->execute(array(":newSession"=>$newSession));

    $qry = $dbh->prepare("INSERT INTO segments SELECT * FROM tmptable_1");
    $qry->execute();

    $qry = $dbh->prepare("DROP TEMPORARY TABLE IF EXISTS tmptable_1;");
    $qry->execute();

    // $result = $qryAry;
    // echo sizeof($result);
}

?>



<!-- CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM table WHERE primarykey = 1;
UPDATE tmptable_1 SET primarykey = NULL;
INSERT INTO table SELECT * FROM tmptable_1;
DROP TEMPORARY TABLE IF EXISTS tmptable_1; -->