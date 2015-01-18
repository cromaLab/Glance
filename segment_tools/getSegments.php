<?php

$session = $_REQUEST['session'];
$clipIndex = $_REQUEST['clipIndex'];

$cmd = "ruby findSegments_simpleRules.rb " . $session . " " . $clipIndex;

// echo $cmd;

// system($cmd);

// echo "hello";
// print_r($output);

$output = exec($cmd)

$array = Array(system($cmd)); #results are 3rd line printed

// print_r($array);

// echo json_encode($array);

?>