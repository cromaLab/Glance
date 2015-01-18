<?php
	#CONNECT TO AND SELECT DB
	function getDatabaseHandle() {
		$dbh = new PDO("mysql:host=localhost;dbname=video_coding", "root", "borkborkbork");
		return $dbh;
	}
?>
