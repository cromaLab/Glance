<?php
include "getDB.php";

try {
  $dbh = getDatabaseHandle();
} catch(PDOException $e) {
  echo $e->getMessage();
}

if($dbh){
  $sth = $dbh->prepare("DELETE FROM segments WHERE id = :id");
  $sth->execute(array("id" => $_REQUEST['id']));  
}
?>