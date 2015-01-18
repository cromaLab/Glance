<?php
	# Change the [USERNAME] and [PASSWORD] fields on line 4 to match your database.
	function getDatabaseHandle() {
		$dbh = new PDO("mysql:host=localhost;dbname=video_coding", "[USERNAME]", "[PASSWORD]");
		return $dbh;
	}
?>
