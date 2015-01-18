<!doctype html>
 
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Crowd Coding</title>
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
  <link rel="stylesheet" href="css/youtube.css" />
  <link rel="stylesheet" href="css/bar.css" />
  <link rel="stylesheet" href="css/button2.css" />
  <link rel="stylesheet" href="https://roc.cs.rochester.edu/LegionJS/LegionTools/LegionJS_Libraries/legion.css" />
  <script src="https://code.jquery.com/jquery-1.9.1.js"></script>
  <script src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
  <script src="scripts/vars.js"></script>
  <script src="https://roc.cs.rochester.edu/LegionJS/LegionTools/LegionJS_Libraries/legion.js"></script>
  <script src="scripts/gup.js"></script>

  <script src="scripts/logVisited.js"></script>

  <!--link rel="stylesheet" href="/resources/demos/style.css" /-->

</head>

<body>
<div id="instructions_section">
    
    <div class="expand"><a href="#" id="instruction_link">Click to hide instructions!</a></div>
<div id="instructions_header">Instructions</div> 
    <div class="content">
      <p> Please watch the following video. <strong id = "action"></strong>.</p>
      <!--p> You can rewind at any time to re-watch for events.</p-->
      <!--p> If there are no events at all, hit <strong> SUBMIT </strong> once the video is finished.</p-->


      <!-- <p><u>Description of Event:</u> <span id ="description"></span>.</p>  -->
    </div>
</div>

<div id="videoPlayer">
<div id="player"></div>
  <div id = "controls">
    <a class="button" id="play">
      <span id ="but_swi" class="_play">Play</span>
    </a>
    <div style="float:right;"> seconds</div>
    <div id="playTime">0</div>
    <div id="timeSlider"></div>
  </div>
  <script src="scripts/youtube.js"></script>
</div>
<!--  <br/>
  <div id="set-buttons">
    <a class="button" data-state="setStart" id ="toggleButton">Set Start</a>
  </div>
    <br/>
<div id="slider-container"></div> -->
<!-- <button id ="addbar">Add a Bar (Enables if all bars are greyed out)</button> -->

<!-- <a class="button" id ="complete">SUBMIT</a> -->


<!--button id ="testb">Test</button-->

<!-- LegionJS -->
  <div id="instructions"></div>
<!-- End LegionJS -->


  <!-- <script src="scripts/firstbar.js"></script> -->
  <!-- <script src="scripts/barappend.js"></script> -->
  <script src="scripts/logging.js"></script>
  <script src="scripts/submitBehavior.js"></script>
  <script src="scripts/instructions.js"></script>
  
  <script> var whatPageIsThis = "coding";</script>


  <p id='legion-money' style="display:none;">.15</p>

 
</body>
</html>
</body>
</html>
