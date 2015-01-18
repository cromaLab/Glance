<!doctype html>
 
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Example</title>
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
  <link rel="stylesheet" href="youtube.css" />
  <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
  <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  <script src="../scripts/gup.js"></script>

  <script src="logVisited.js"></script>
  
  <script src="example.js"></script>

</head>

<body>
<h1>Example</h1>
<p> On the next page, you will be looking for instances of <strong id = "action"></strong>.</br> Description: <span id ="description"></span>.</p> 

<div id="clip">
<p>The following clip presents an example of this action. Watch then video, then continue to the task. </p>
<div id="videoPlayer">
<div id="player"></div>
	<p id = "controls">
	<button id="play" type="button">Play</button>
	<div id="playTime">0</div>
	<div id="timeSlider"></div>
	</p>
  <script src="youtube.js"></script>
</div>
</div>
</br>

</br>
<form action="index.html">
    <input id="continue" type="submit" value="Watch entire clip" style="margin-left:100px;" disabled = "disabled">
</form>



 
</body>
</html>
</body>
</html>
