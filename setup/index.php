<!doctype html>

<html lang="en">
<head>
<meta charset="utf-8" />
<title>End-User Setup</title>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
<link rel="stylesheet" href="css/setup.css" />
<link rel="stylesheet" href="css/bar.css" />
<script src="scripts/jquery1.9.js"></script>
<script src="scripts/jquery_ui.js"></script>
<script src="../utils/gup.js"></script>
<script src="scripts/addLabel.js"></script>
<script src="scripts/bar.js"></script>
<script src="scripts/displaySegments.js"></script>
<script src="scripts/postClips.js"></script>
<script src="scripts/debug.js"></script>
<script src="scripts/range-bar.js"></script>
<!-- <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"> -->
<link rel="stylesheet" href="css/pure-min.css">
<link rel="stylesheet" href="css/bootstrap.css">
<!--
  <script src="vis_tools/scripts/segvis.js"></script>
  <link rel="stylesheet" href="vis_tools/css/vis.css" />
  <link rel="stylesheet" href="vis_tools/css/style.css" /> -->

</head>
<?php

	function get_url(){

		if(isset($_POST['videourl'])){
			$videourl = $_POST['videourl'];
			return $videourl;
		}
	}


?>

<body>
<div class="page">
<div class="page-center-container">
  <div>
    <div class="col-sm-6 col-md-2">
      <div class="thumbnail height-390">
        <form id="loadVideo" method="post">
          <input id="videoURL" name="videourl" class="form-control" placeholder="Video URL">
          <input type="submit" value="Load Video" id="loadVideoButton" disabled = "disabled" class="btn btn-primary marging-top">
        </form>
        <p>
        <div class="row">
          <div class="col-sm-6 col-md-6"> <?php echo get_url();  ?> </div>
        </div>
        <div class="row margin-top-160">
          <div class="col-sm-6 col-md-12">
          <div class="helper_with">
              <div class="margin-auto_helper">
                <center>
                  <strong>Play Time</strong>
                  <div class="thumbnail">
                    <div id="playTime">0</div>
                  </div>
                </center>
              </div>
            </div>
            </div>
        </div>
        <div class="row marging-top">
          <div class="col-md-6 col-lg-12 margin-top">
          <center>
            <div id="controls">
              <button id="play" type="button" class="play-dimenstions">
              <center>
              <span class="ui-button-icon-primary ui-icon ui-icon-play icon-dimesions"></span> <span class="ui-button-text"></span>
              <center>
              </button>
            </div>
            </center>
          </div>
        </div>
        </p>
      </div>
    </div>
    <div class="col-sm-6 col-md-6">
      <div class="thumbnail">
        <div id="videoPlayer">
          <div id="player"></div>
        </div>
      </div>
      Note: results are not real-time. </br>
      Send workers to: <a href="url" style="font-size:11px;" id="urlToSendWorkers"></a></br>
      For more detailed results: <a href="url" style="font-size:11px;" id="visToolUrl"></a>
    </div>
    <div class="col-sm-6 col-md-3">
      <div class="col-sm-6 col-md-12" id="addLabels">
        <div class="thumbnail padding-bottom-12">
          <form id="newLabel" class="pure-form pure-form-aligned">
            <div class="row">
              <div class="col-md-6 col-lg-12 marging-top">
                <input id="action" class="" type="text" placeholder="Action to label">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-lg-12 marging-top">
                <input id="description" type="text" placeholder="Action description">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-lg-12 marging-top">
                <input id="sessionOverride" type="text" placeholder="Session (must be unique, and remember it)">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-lg-12 marging-top margin-right-zero"> <strong>Time range (seconds):</strong> </div>
            </div>
            <div class="row marging-top">
              <div class="col-md-6 col-lg-5">
                <input type="text" class="form-control" placeholder="start time" id = "startTimeField">
              </div>
              <div class="col-md-6 col-lg-1"> - </div>
              <div class="col-md-6 col-lg-5">
                <input type="text" class="form-control" placeholder="end time" id = "endTimeField">
              </div>
            </div>
            <div class="row marging-top">
              <div class="col-md-6 col-lg-5 margin-top">
                <input type="button" id="showOptions" class="btn btn-primary" value="Show Advanced Options &darr;" />
              </div>
            </div>
            <div class="row marging-top">
              <div class="col-md-6 col-lg-5 margin-top">
                <button class="btn btn-primary" disabled="disabled" id="chooseExampleButton">Choose Example</button></br>
                <button class="btn btn-primary" disabled="disabled" id="saveExampleButton">Save Example</button></br>
              </div>
            </div>
            <div id="options">
              <div class="row marging-top">
                <div class="col-md-6 col-lg-12 margin-top"> <strong>Depth:</strong>
                  <select id="depthSelect">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option selected="selected" value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <strong>Sample:</strong>
                  <select id="sampleSelect">
                    <option value="20">20%</option>
                    <option value="40">40%</option>
                    <option value="60">60%</option>
                    <option value="80">80%</option>
                    <option selected = "selected" value="100">100%</option>
                  </select>
                </div>
              </div>
              <div class="row marging-top">
                <div class="col-md-6 col-lg-12 margin-top"> <strong>Clip length (in seconds):</strong>
                  <input size="4" id="clipLength" value="30">
                </div>
              </div>
<!--               <div class="row marging-top">
                <div class="col-md-6 col-lg-12 margin-top"> <strong>Session name:</strong>
                  <input id="sessionOverride" value="">
                </div>
              </div> -->
            </div>
            <input type="submit" value="Get Labels!" id="getLabelsButton" disabled = "disabled" class="btn btn-danger">
          </form>
        </div>
      </div>
      <div class="col-sm-6 col-md-12">
<!--         <div class="thumbnail">
          <form class="pure-form">
            <label for="sampleSelect">Raise percent</label>
            <select disabled="true" id="sampleSelectRaise">
              <option value="20">20%</option>
              <option value="40">40%</option>
              <option value="60">60%</option>
              <option value="80">80%</option>
              <option value="100">100%</option>
            </select>
            <br/>
            <label for="sampleDepth">Depth</label>
            <select disabled="true" id="sampleDepth">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <br/>
            <div class="marging-top">
              <button class="btn btn-primary" disabled="true" id="raiseSampleButton">Wait!</button>
              <button id = "cancelQueryButton" class="btn btn-danger">Cancel Query</button>
            </div>
            <span id='tabspan" + num_tabs + "'> </span>
          </form>
        </div> -->
        <button id = "cancelQueryButton" class="btn btn-danger">Deactivate session</button>
      </div>
    </div>
    <div class="col-sm-6 col-md-1">
      <div id="tabs"> </div>
    </div>
  </div>
</div>
<div class="page-center-container">
  <div class="row marging-top">
    <div class="col-md-6 col-lg-12 margin-top">
      <div id="timeSlider"></div>
      <div id="slider-container"></div>
      <div id="segments"></div>
      <script src="scripts/youtube.js"></script>
    </div>
  </div>
  <div class="row marging-top">
    <div class="col-md-6 col-lg-12 margin-top">
      <form class="pure-form pure-form-aligned" onSubmit="return false">
        <ul class="paddingnone" id="bars_maker">
        </ul>
        <input type="hidden" id="iframe_working" value="0" />
        <input type="hidden" id="youtube_loaded" value="0" />
      </form>
    </div>
  </div>
  <div class="row marging-top">
    <div class="col-md-6 col-lg-12"> <img src="images/plus.png" alt="Add Manually" class="cursor-pointer" onClick="addBar();" /> </div>
  </div>
</div>

<!-- <div id="instructions">
    1. Enter a YouTube video URL and trial name at the top. Click "Load". </br>
    2. Enter an action, description, start time, and end time. </br>
    3. Use the colored range slider to specify an example of your action. </br>
    4. Click "Get Labels!" </br>
    5. To view segments or raise the sample percentage, click on a session's tab.
</div> -->

</body>
</html>
