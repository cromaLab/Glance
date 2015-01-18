<?php
// USAGE: loadBaselineStatesintoDb.php?session=<session>
// KNOWN BUGS: a segment cannot be spread across more than 2 clips

error_reporting(E_ALL);
ini_set("display_errors", 1);

include('../coding_tools/php/getDB.php');

// Number of clips in each session
$numClips = 10;
// File holding segments times. Times must be in HH:MM:SS-HH:MM:SS format
$fileName = "times.txt";
// Start time of video in seconds
$videoStart = 0;
// End time of video in seconds
$videoEnd = 600;
// Clip length at 1x
$clipLength = 60;
// Playback speed of video (1 for 1x, 2 for 2x, etc)
$playbackSpeed = 1;

// Converts HH:MM:SS to secondss
function timeToSeconds($str_time){
    sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);

    $time_seconds = isset($seconds) ? $hours * 3600 + $minutes * 60 + $seconds : $hours * 60 + $minutes;

    return $time_seconds;
}

//Returns array that matches clip index (represnted by the array index) to the end time of each clip
function makeClipBuckets($videoStart, $videoEnd, $clipLength){
    $array = array();
    for($i = 0; $i < ($videoEnd - $videoStart) / $clipLength; $i++){
        array_push($array, $clipLength * ($i + 1));
    }
    return $array;
}

// // Return clipIndex for a given time
function findClipIndex($time, $clips){
    for($i = 0; $i < sizeof($clips); $i++){
        if($time < $clips[$i]) return $i;
    }
    return -1;
}

if( isset($_REQUEST['session'])) {

  try {
    $dbh = getDatabaseHandle();
  } catch( PDOException $e ) {
    echo $e->getMessage();
  }

    if( $dbh ) {

        $session = $_REQUEST["session"];

        // Create new rows in setup table
        $newSession = $session . "Baseline2";

        $qry = $dbh->prepare("CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM setup WHERE session=:session");
        $qry->execute(array(":session"=>$session));

        $qry = $dbh->prepare("UPDATE tmptable_1 SET setupId = NULL");
        $qry->execute();

        $qry = $dbh->prepare("UPDATE tmptable_1 SET session = :newSession");
        $qry->execute(array(":newSession"=>$newSession));

        $qry = $dbh->prepare("INSERT INTO setup SELECT * FROM tmptable_1");
        $qry->execute();

        $qry = $dbh->prepare("DROP TEMPORARY TABLE IF EXISTS tmptable_1;");
        $qry->execute();


        // Create new rows in visited table
        for($i = 0; $i < $numClips; $i++){
            // echo "success";
            $sth = $dbh->prepare("INSERT INTO visited (workerId, arrivalTime, submitTime, session, clipIndex, page, firstSaw) values (:workerId, 9999, 9999, :session, :clipIndex, 'coding', 9999)");
            $sth->execute(array(':workerId' => "mitchell", ":session" => $newSession, ":clipIndex" => $i));
        }

    }

    $clipTimes = makeClipBuckets($videoStart, $videoEnd, $clipLength);
    // print_r($clipTimes);

    // Create new rows in segments table
    $handle = fopen($fileName, "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            $times = explode("-", $line);
            $start = timeToSeconds($times[0]) / $playbackSpeed;
            $end = timeToSeconds($times[1]) / $playbackSpeed;
            $clipIndexStart = findClipIndex($start, $clipTimes);
            $clipIndexEnd = findClipIndex($end, $clipTimes);

            // If both start and end are in the same clip
            // if(($end % $clipLength + $start % $clipLength) < $clipLength){
            if($clipIndexStart == $clipIndexEnd){
                $sth = $dbh->prepare("INSERT INTO segments (session, author, startSegment, endSegment, confidence, clipIndex) values (:session, :author, :startSegment, :endSegment, :confidence, :clipIndex)");
                $sth->execute(array(":session" => $newSession, ":author" => "mitchell", ":startSegment" => $start, ":endSegment" => $end, ":confidence" => "N/A", ":clipIndex" => $clipIndexStart));
            }
            else{
                //Insert segment from earlier clip
                $sth = $dbh->prepare("INSERT INTO segments (session, author, startSegment, endSegment, confidence, clipIndex) values (:session, :author, :startSegment, :endSegment, :confidence, :clipIndex)");
                $sth->execute(array(":session" => $newSession, ":author" => "mitchell", ":startSegment" => $start, ":endSegment" => ($clipIndexStart + 1) * $clipLength, ":confidence" => "N/A", ":clipIndex" => $clipIndexStart));

                // Insert segment from later clip
                $sth = $dbh->prepare("INSERT INTO segments (session, author, startSegment, endSegment, confidence, clipIndex) values (:session, :author, :startSegment, :endSegment, :confidence, :clipIndex)");
                $sth->execute(array(":session" => $newSession, ":author" => "mitchell", ":startSegment" => ($clipIndexStart + 1) * $clipLength, ":endSegment" => $end, ":confidence" => "N/A", ":clipIndex" => $clipIndexEnd));

            }
        }
    } else {
        // error opening the file.
    }
}
else {
    print("FAILING");
}
?>
