<?php
include "getDB.php";

try {
  $dbh = getDatabaseHandle();
} catch(PDOException $e) {
  echo $e->getMessage();
}

if($dbh){
  $sth = $dbh->prepare("SELECT * FROM setup WHERE session = :session ORDER BY setupId DESC LIMIT 1");
  $sth->execute(array("session" => $_REQUEST['session']));  
  $results = $sth->fetchAll(PDO::FETCH_ASSOC);
  $json=json_encode($results);
  echo $json;
}
?>