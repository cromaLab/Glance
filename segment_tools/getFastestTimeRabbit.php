<?php
// USAGE: getFastesTime.php?session=<session>&oldClips=<bool>
// Only set the oldClips param to true for the first set of rabbit clips

error_reporting(E_ALL);
ini_set("display_errors", 1);

include('../coding_tools/php/getDB.php');

$numClips = 20;
$numWorkers = 3;
if( isset($_REQUEST['session'])) {

  try {
    $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
    echo $e->getMessage();
  }

  if( $dbh ) {


    $session = $_REQUEST['session'];
    $times = array();

    $timeSets = array();
    for( $clip = 0; $clip < $numClips; $clip++ ) {

      $sth = $dbh->prepare("SELECT * FROM visited WHERE session = :session AND firstSaw IS NOT NULL AND clipIndex = :clip");
      $sth->execute(array(':session'=>$session, ':clip'=>$clip));
      $rows = $sth->fetchAll();
      // print_r($rows);

      $tempTimes = array();
      for($i = 0; $i < sizeof($rows); $i++){
        $row = $rows[$i];

        // Needed for old clips that use a timestamp format
        if(isset($_REQUEST['oldClips'])){
          if($_REQUEST['oldClips'] == "true"){
            $diff = strtotime($row['firstSaw']) - strtotime($row['arrivalTime']);
          }
        }
        // If the clips are newer, they are just stored as floats in the db and can simply be subtracted
        else $diff = $row['firstSaw'] - $row['arrivalTime'];

        array_push($tempTimes, $diff);
        array_push($times, $diff);

        // array_push($times, $diff->s);
      }
      sort($tempTimes);
      // print_r($times);
      for( $topIdx = 0; $topIdx < 3; $topIdx++ ) {
        if( !array_key_exists($topIdx, $timeSets) ) {
	        $numWorkers++;
	        $timeSets[$topIdx] = array();
      }
        array_push($timeSets[$topIdx], $tempTimes[$topIdx]);
      }

      // echo "</br>" . "Clip: " . $clip . " First: " . $tempTimes[0] . PHP_EOL . "Second: " . $tempTimes[1] . PHP_EOL . "Third: " . $tempTimes[2] . PHP_EOL . " Average: " . array_sum($tempTimes)/sizeof($tempTimes);
      echo "</br>" . $clip . "," . $tempTimes[0] . "," . $tempTimes[1] . "," . $tempTimes[2] . "," . $tempTimes[3] . "," . $tempTimes[4];

    }

    for( $w = 0; $w < $numWorkers; $w++ ) {
	    echo "<br>" . ($w + 1) . "-worker average: " . array_sum($timeSets[$w])/sizeof($timeSets[$w]);
    }

    echo "</br>" . "Overall average: " . array_sum($times)/sizeof($times);

  }
}
else {
    print("FAILING");
}
?>
