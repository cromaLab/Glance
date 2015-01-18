<?php

$session = $_REQUEST['session'];
$clipIndex = $_REQUEST['clipIndex'];

$cmd = "ruby findSegments_simpleRules.rb " . $session . " " . $clipIndex;

echo $cmd;

echo system($cmd);

// echo "hello";
// print_r($output);

// $array = Array($output[0]); #results are 3rd line printed

// echo json_encode($array);

?>