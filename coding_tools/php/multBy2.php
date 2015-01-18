<?php

$array = array(2185.7,2187.1);

for($i = 0; $i < sizeof($array); $i++){
	$array[$i]=$array[$i]*2;
}

print_r($array);

?>