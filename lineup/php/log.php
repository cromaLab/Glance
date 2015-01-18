<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

include('getDB.php');

if( !isset($_REQUEST['answer']) ) {
    print 'no message';
}
if( !isset($_REQUEST['session']) ) {
    print 'no session';
}

if( isset($_REQUEST['answer']) && isset($_REQUEST['session']) ) {
  echo "here";

  try {
    $dbh = getDatabaseHandle();
  } catch(PDOException $e) {
    echo $e->getMessage();
  }

    if( $dbh ) {
        $sth = $dbh->prepare("INSERT INTO answers (answer, question, session, workerId, setupId, clipIndex) values (:answer, :question, :session, :workerId, :setupId, :clipIndex)");
        $sth->execute(array(':session'=>$_REQUEST['session'], ':answer'=>$_REQUEST['answer'], ':question'=>$_REQUEST['question'],':workerId'=>$_REQUEST['workerId'],':setupId'=>$_REQUEST['setupId'],':clipIndex'=>$_REQUEST['clipIndex']));
    }
    
    print("SUCCESS");
  }


else {
print("FAILING");
}
?>