<?php
include "getDB.php";

try {
  $dbh = getDatabaseHandle();
} catch(PDOException $e) {
  echo $e->getMessage();
}

if($dbh){
  $sth = $dbh->prepare("SELECT * FROM setup WHERE setupId = :setupId ORDER BY setupId DESC LIMIT 1");
  $sth->execute(array("setupId" => $_REQUEST['setupId']));  
  $results = $sth->fetchAll(PDO::FETCH_ASSOC);
  $json=json_encode($results);
  echo $json;
}
?>