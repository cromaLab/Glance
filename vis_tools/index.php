<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Segment Visualizer</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/vis.css" />
  <link rel="stylesheet" href="css/jquery.qtip.min.css" />

  <script src="//code.jquery.com/jquery-1.9.1.js"></script>
  <script src="//code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  <script src="../utils/gup.js"></script>
  <script src="scripts/segvis.js"></script>
  <script src="scripts/jquery.qtip.min.js"></script>
</head>

<body>

	<div id="selectTools">
		<input type="textbox" id="sessionSelector" placeholder="Session Name">
		<!-- TODO: add "zoom" view that allows us to visualize a single clip, not just a whole session. -->
		<!--input type="textbox" id="clipIdxSelector" placeholder="Idx"-->
		<input type="button" id="getInfo" value="Get Segment Info!">
		<br>
		<input type="checkbox" id="aggregateOnly">Show only the final answer</input>
	</div>


	<div id="detailContainer">
	</div>
	<div id="simpleContainer">
	</div>

	<div id="visContainer">

	</div>
	<input type="button" id="downloadCsv" value="Download CSV" disabled="disabled">

	<div id="exp-container">

	</div>

	<br>
	<br>

	<div id="notes">
		Hint: For quicker use, pass in '?session=' to immediately load a dataset!
	</div>

	<br>

	<div id="statsContainer">
	</div>

</body>

</html>
</body>
</html>
