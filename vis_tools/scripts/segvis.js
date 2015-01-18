rowHeight = 10;
columnWidth = 500;
nextIdx = 0;
spacing = 1.0;  // Space between clip divs in px
vspacing = 5.0;  // Space between clip divs in px
levelOffset = 10;
widthPercent = .5;  // Select how wide we want the vis to be
sigfigs = 2;

failTimeoutLen = 8000;
segsLeft = 0;
failTimeoutH = null;

// SETTINGS
useContext = false;

// URL OPTIONS
g_useDetails = gup("details").toLowerCase() == "true" ? true : false;
embed = gup("embedded") == "true" ? true : false  // Handle the case where the vis tool is embedded

// EMBED SETTINGS
clipStartingHeight = 40;

csvData = [];

function postResults(clipDivArray, session, clipIdx, tool, level, color, suffix, type, useDet) {
    var useDetails = useDet;
console.log("Entering with: " + useDetails);

    segsLeft++;
    $.ajax({
        url: "php/getInfo.php",
        aync: false,
        type: "POST",  // To ensure refresh in IE
        data: {session: session, clipIndex: clipIdx, findSegTool: tool, suffix: suffix, type: type},
        dataType: "text",
        success: function(b) {
            var inIdx = b.substring(0, b.indexOf("="));
            var bstr = b.substring(b.indexOf("=")+1, b.length);
            curClipStart = clipDivArray[inIdx][1];
            curClipEnd = clipDivArray[inIdx][2];

            // Parse the info into html
            var curClipDiv = clipDivArray[inIdx][0];

            addToCsv(session, clipIdx, type, bstr);
            createVis(bstr, curClipDiv, level, curClipStart, curClipEnd, '', color, useDetails);
            curClipDiv.height(curClipDiv.height() + $('.segMarker').height() + vspacing);
            segsLeft--;
            console.log("Back from vis:: " + segsLeft + " segments remaining for run detail = " + useDetails);

            // Once we have all of the answers, render everything
            if( segsLeft == 0 ) {  // TODO: Can be made slightly faster by only waiting for the req divs?
                // Copy the right values into the visible div
                if( g_useDetails ) {
                    $('#visContainer').html($('#detailContainer').html());
                }
                else {
                    $('#visContainer').html($('#simpleContainer').html());
                }
                $('#downloadCsv').removeAttr("disabled");

                // Render segment time tips
                defQTip('.segMarker');

                // Show the expansion (zoomed) div on mouse-over
                $('.clipSpan').mouseenter( function() {
                    curID = $(this).attr('id')
                    if( curID.indexOf("d-") < 0 ) {
                        curID = "d-" + curID.substring(2, curID.length);
                    }
                    var prefix = "#d-clip_";

                    curIdx = parseInt(curID.substring(7, curID.length));  // where 7 == "d-clip_".length

                    if( curIdx > 0 ) {
                        newDivPrev = "<div id='expanded_" + (curIdx-1) + "'>" + $(prefix+(curIdx-1)).attr('info') + "</div>";
                    }
                    newDivCur = "<div id='expanded_" + curIdx + "' class='curExp'>" + $(prefix+curIdx).attr('info') + "</div>";
                    if( curIdx < clips.length ) {
                        newDivNext = "<div id='expanded_" + (curIdx+1) + "'>" + $(prefix+(curIdx+1)).attr('info') + "</div>";
                    }

      

                    widthTotal = 0.0;

                    // If we're not at the beginning, add the 'previous' clip
                    if( useContext && curIdx > 0 ) {
                        prevWidthStr = $(prefix+(curIdx-1)).css('width');
                        prevWidth = parseFloat(prevWidthStr.substring(0, prevWidthStr.length));  // 2 chars removes "px" from the end
                        widthTotal += prevWidth;
                    }

                    // Add information for the current clip
                    curWidthStr = $(prefix+(curIdx)).css('width');
                    curWidth = parseFloat(curWidthStr.substring(0, curWidthStr.length));
                    widthTotal += curWidth;

                    // If we're not at the end, then add the 'next' clip
                    if( useContext && curIdx < clips.length-1 ) {
                        nextWidthStr = $(prefix+(curIdx+1)).css('width');
                        nextWidth = parseFloat(nextWidthStr.substring(0, nextWidthStr.length));
                        widthTotal += nextWidth;
                    }

                    //console.log("P: " + prevWidthStr + ", C: " + curWidthStr + ", N: " + nextWidthStr)
                    if( useContext ) {
                        widthTotal += (2 * spacing);  // Add room for 2 spaces between the 3 sections
                    }
                    else {
                        widthTotal += (1 * spacing);  // Add room for 2 spaces between the 3 sections
                    }

                    if( useContext ) {
                        curElem = "<div id='exp-elem-cur' class='clipSpan curExp' style='height:" + $(prefix+(curIdx)).height() + "px; width:" + ((curWidth*100.0) / widthTotal) + "%'>" + $(prefix+(curIdx)).html() + "</div>";
                        prevElem = "<div id='exp-elem-prev' class='clipSpan' style='width:" + ((prevWidth*100.0) / widthTotal) + "%'>" + $(prefix+(curIdx-1)).html() + "</div>";
                        nextElem = "<div id='exp-elem-next' class='clipSpan' style='width:" + ((nextWidth*100.0) / widthTotal) + "%'>" + $(prefix+(curIdx+1)).html() + "</div>";
                    }
                    else {
                        curElem = "<div id='exp-elem-cur' class='clipSpan curExp' style='height:" + $(prefix+(curIdx)).height() + "px; width:100%'>" + $(prefix+(curIdx)).html() + "</div>";
                    }

                    toAddElem = '';
                    if( useContext && curIdx > 0 ) {
                        toAddElem += prevElem;
                    }
                    toAddElem += curElem;
                    if( useContext && curIdx < clips.length-1 ) {
                        toAddElem += nextElem;
                    }

                    $('#exp-container').html(toAddElem);
                });

                // Clear the expansion div on un-hover
                $('.clipSpan').mouseleave( function() {
                    // TODO: REMOVE THIS COMMENT (in place temp for testing)	
                    $('#exp-container').html('');
                });

                // Add the clip time tips
                defQTip('.clipSpan');  // TODO: Does this belong here?
            }

        },
        failed: function(){
            // Let the user know we failed to get their information
            alert("Fetching info failed 1 =(");
        }
    });


    //console.log("call DONE");
}

function postStats(topic, session, tool, type, color) {
    var selects = ['area', 'count', 'aligned'];
    for (var i in selects) {
        toAddSection = "<div id='" + topic + "-stats_" + selects[i] + "' class='statSection' style='border: solid 4px " + color + "'><b>" + topic.toUpperCase() + "-" + selects[i].toUpperCase() + "</b>: </div>";
        $('#statsContainer').append(toAddSection);
    }


    $.ajax({
        url: "php/getStats.php",
        aync: false,
        type: "POST",  // To ensure refresh in IE
        data: {session: session, findSegTool: tool, type: type},
        dataType: "json",
        success: function(s) {
          s = $.parseJSON(s.replace(/NaN/g, 'null'));
          for (var i in selects) {
              createStatEntry(topic, s, selects[i]);
          }
        },
        error: function(){
          // Let the user know we failed to get their information
          alert("Fetching info failed 2 =(");
        }
    });

}


// 
function createClipDivs(clipsStr, wndh, useDet) {
  var useDetails = useDet;

  //divWidth = wndh.width() * widthPercent;
  divWidth = $('#visContainer').width() * widthPercent;

  clipStrAry = clipsStr.split(";");
  clips = new Array();
  totalClipLen = 0;
  for( i = 0; i < clipStrAry.length; i++ ) {
    clips[i] = new Array();
    clips[i][0] = parseFloat(clipStrAry[i].split("-")[0]);
    clips[i][1] = parseFloat(clipStrAry[i].split("-")[1]);
    totalClipLen += clips[i][1] - clips[i][0];
  }

  var prefixName = '';
  if( useDetails ) {
    prefixName = "d-clip_";
  }
  else {
    prefixName = "s-clip_";
  }

  //clipUnitWidthPx = (divWidth - (spacing*(clips.length-1))) / totalClipLen;
  clipUnitWidthPx = (((1-((spacing*(clips.length-1))/divWidth))*100.0) / clips.length) + "%";

  // Note: This version allows for unequal clip lengths
  var clipDivs = new Array();
  curOffsetPx = 0.0;
  for( i = 0; i < clips.length; i++ ) {
    // Create and append the clip div
    toAddElem = "<div id='" + prefixName + i + "' class='clipSpan' style='height: " + clipStartingHeight + "px; width: " + clipUnitWidthPx + ";' info='start: " + clips[i][0].toFixed(sigfigs) + "; end: " + clips[i][1].toFixed(sigfigs) + "'>";
    if( !embed ) {
      toAddElem += "<div id='label_" + i + "' class='clipLabel'><b>#" + i + "</b></div>";
    }
    toAddElem += "</div>";
    wndh.append(toAddElem);

    // Update the offset
    //curOffsetPx += curClipLenPx;
    clipDivs[i] = [$('#'+prefixName+i), clips[i][0], clips[i][1]];
  }

  // Return the clip div handle set
  return clipDivs;
}


function createStatEntry(topic, data, select) {
  // Get the per-clip and aggregate data
  clipData = data['clip_stats'];
  aggrData = data['total_stats'];

  for( i = 0; i < clipData.length; i++ ) {
    // Parse the results and add them to the stats div
    toAddEntry = "<div id='" + topic + "-statsEntry_" + i + "' class='statEntry'>Clip #" + i + ": Precision = " + (parseFloat(clipData[i][select]['precision'])*100.0).toFixed(sigfigs) + "%, Recall = " + (parseFloat(clipData[i][select]['recall'])*100.0).toFixed(sigfigs) + "%";
    if( clipData[i][select]['shift'] ) {
      toAddEntry += ", Other = " + (parseFloat(clipData[i][select]['shift'])).toFixed(sigfigs);
    }
    toAddEntry += "</div>";
    $('#'+topic+"-stats_"+select).append(toAddEntry);
  }

  toAddEntry = "<div id='" + topic + "-statsEntry_aggr' class='statEntry'><b><i>Overall</i>: Precision = " + (aggrData[select]['precision']*100.0).toFixed(sigfigs) + "%, Recall = " + (aggrData[select]['recall']*100.0).toFixed(sigfigs) + "%</b></div>";
  $('#'+topic+"-stats_"+select).append("<br>");
  $('#'+topic+"-stats_"+select).append(toAddEntry);
}

// Add segment lines to a clip div
function createVis(inData, clipDiv, level, clipStart, clipEnd, addClass, color, useDet) {
  // alert(inData);
  if( inData == '' ) {
    return '';
  }

  var useDetails = useDet;

  retStr = "";


  segStr = inData.split(";");
  segments = new Array();
  for( i = 0; i < segStr.length; i++ ) {
    // Get the start and end times from the string
    curAry = segStr[i].split("-");

    // Create a new segment entry
    segments[i] = new Array();
    // Fill in the new segment
    segments[i][0] = parseFloat(curAry[0]);
    segments[i][1] = parseFloat(curAry[1]);
  }

  // Find the length of the clip the segments we have belong to
  clipLen = clipEnd - clipStart;
  for( i = 0; i < segments.length && (i == 0 || useDetails); i++ ) {
    // Find the proportion of this segment to the whole clip
    curSegRatio = (segments[i][1] - segments[i][0]) / clipLen;
    curOffsetRatio = (segments[i][0] - clipStart) / clipLen;

    // Find the position values in pixels
    if( useDetails ) {
      //curSegLenPx = (curSegRatio * (clipDiv.width()-spacing)) + "px";
      curSegLenPx = (curSegRatio*100.0) + "%";
      //curOffsetPx = (curOffsetRatio * (clipDiv.width()-spacing)) + "px";
      curOffsetPx = (curOffsetRatio*100.0) + "%";
    }
    else {
      //curSegLenPx = clipDiv.width();
      //curOffsetPx = 0;//clipStart/clipLen;
      curSegLenPx = "100%";
      curOffsetPx = "0%";//clipStart/clipLen;
    }

    //console.log("Ratios: (" + segments[i][1] + "-" + segments[i][0] + ")/" + clipLen + " = " + curSegRatio + " | " + curOffsetRatio + "  ==> Lengths: " + curSegLenPx + " | " + curOffsetPx + " // Time: " + (segments[i][1] - segments[i][0]));

    // Now, add the segment visuals
    var segPrefixName = '';
    if( !useDetails ) {
      segPrefixName = "segment_";
    }
    else {
      segPrefixName = "d-segment_";
    }

//console.log("USING " + segPrefixName + " ...useDetails: " + useDetails)

    toAddSeg = "<div id='" + segPrefixName + nextIdx + "' class='segMarker " + addClass + "' style='background: " + color + "; top: " + ((level+levelOffset)*rowHeight) + "px; left: " + curOffsetPx + "; width: " + curSegLenPx + ";' info='Start: " + segments[i][0].toFixed(sigfigs) + "; End: " + segments[i][1].toFixed(sigfigs) + "'></div>";
    nextIdx++;
//console.log("ADDING TO : ", clipDiv)
    clipDiv.append(toAddSeg);
  }

  // Return the final visualization
  return retStr;
}

/*
function delayDefQTip(divName) {
  setTimeout( function() {
    defQTip(divName);
  }, dTime);
}
*/

function defQTip(divName) {
    $(divName).qtip({
      content: {
        attr: 'info',
        show: { event: 'click' }
      }
    });
}


function getAnswers(clipDivArray, useDet) {
         var useDetails = useDet;


         for( var curIdx = 0; curIdx < clipDivArray.length; curIdx++ ) {
          // Get the baseline results
          if( !embed ) {
            console.log("Adding baseline...")

            // Select the right baseline session name
            var session = $("#sessionSelector").val();
            var baselineSession;
            if(session == "interview_level3_headturn" || session == "interview_level4_headturn" || session == "interview_level6_headturn" || session == "interview_level5_headturn" || session == "interview_level10_headturn") baselineSession = "interview_baseline_headturn";
            else if (session == "interview_level3_eyeContact" || session == "interview_level4_eyeContact" || session == "interview_level6_eyeContact" || session == "interview_level5_eyeContact" || session == "interview_level10_eyeContact") baselineSession = "interview_baseline_eyeContact";
            else if (session == "interview_level3_smile" || session == "interview_level4_smile" || session == "interview_level6_smile" || session == "interview_cropped_smile" || session == "interview_level5_smile" || session == "interview_level10_smile") baselineSession = "interview_baseline_smile";
            else if (session == "interview_level3_openbody" || session == "interview_level4_openbody" || session == "interview_level6_openbody" || session == "interview_level5_openbody" || session == "interview_level10_openbody") baselineSession = "interview_baseline_openbody";
            else if (session == "interview_level3_facetouch" || session == "interview_level4_facetouch" || session == "interview_level6_facetouch" || session == "interview_level5_facetouch" || session == "interview_level10_facetouch") baselineSession = "interview_baseline_facetouch";
            else baselineSession = session + "Baseline2";

            postResults(clipDivArray, baselineSession, curIdx, "findSegments_simpleRules.rb", -8, '#0a0', '', '', useDetails);
          }

          // Get the aggregated output
          // Function format: postResults(session, clipIdx, tool, level, color, suffix)
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_scanning.rb", -7, '#f80', '', 'default', useDetails);
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_scanning.rb", -6, '#f00', '', 'jaccard', useDetails);
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_scanning.rb", -5, '#fd0', '', 'f1', useDetails);
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_scanning.rb", -4, '#000', '', 'noem', useDetails);
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_scanning.rb", -3, '#fff', '', 'kmeans', useDetails);
          postResults(clipDivArray, $("#sessionSelector").val(), curIdx, "findSegments_simpleRules.rb", -2, '#f0f', '', '', useDetails);


         //console.log("Getting worker answers...");
         if( !$('#aggregateOnly').is(':checked') && !embed ) {
          // Now get all of the individual worker input
          $.ajax({
            url: "php/getRawInput.php",
            aync: false,
            type: "POST",  // To ensure refresh in IE
            data: {session: $("#sessionSelector").val(), clipIndex: curIdx},
            dataType: "text",
            success: function(d) {
              metaPair = d.substring(0, d.indexOf("=")).split(",");
              inIdx = metaPair[0];
              wCount = metaPair[1];
              if( !embed ) { //useDetails ) {
                $('#label_'+inIdx).html($('#label_'+inIdx).html() + ": " + wCount + " workers");
              }
             
              var d = d.substring(d.indexOf("=")+1, d.length);
              var curClipStart = clipDivArray[inIdx][1];
              var curClipEnd = clipDivArray[inIdx][2];

              var dSet = d.split("|");

              for( var dIdx = 0; dIdx < dSet.length; dIdx++ ) {
                segsLeft++;
                // 
                var curD = dSet[dIdx].substring(dSet[dIdx].indexOf(":")+1, dSet[dIdx].length);

                addToCsv(session, curIdx, "worker", curD);

                // Parse the info into html
                var curClipDiv = clipDivArray[inIdx][0];
                createVis(curD, curClipDiv, dIdx, curClipStart, curClipEnd, 'thin', '#00f', useDetails);
                curClipDiv.height(curClipDiv.height() + $('.segMarker').height() + vspacing);
                segsLeft--;
              }
              if( segsLeft == 0 ) {
                console.log("Done with workers");
              }
              if( useDetails ) {
                $('#label_'+inIdx).html($('#label_'+inIdx).html() + " (" + dSet.length + " reporting)");
              }
            },
            failed: function(){
              // Let the user know we failed to get their information
              alert("Fetching info failed 3 =(");
            }
           });
          }
         }
};

function addToCsv(session, clipIdx, type, inData){
  segStr = inData.split(";");
  segments = new Array();
  for( i = 0; i < segStr.length; i++ ) {
    // Get the start and end times from the string
    curAry = segStr[i].split("-");

    // Create a new segment entry
    segments[i] = new Array();
    // Fill in the new segment
    segments[i][0] = parseFloat(curAry[0]);
    segments[i][1] = parseFloat(curAry[1]);
  }

  for( i = 0; i < segments.length; i++ ) {
    csvData.push([session, clipIdx, type, segments[i][0], segments[i][1]]);
  }

}

function downloadCSV(data, session){
  // The CSV file columns
  console.log(data);
  var csvHeader = ["session", "clip", "type", "start", "end"];
  data.unshift(csvHeader);

  var csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(infoArray, index){

     dataString = infoArray.join(",");
     csvContent += dataString + "\n";

  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data.csv");

  link.click();
}

$(document).ready( function() {
  // Hide the "real" info containers
  $('#detailContainer').hide();
  $('#simpleContainer').hide();

  if( embed ) {
    $('#selectTools').hide();
    $('#notes').hide();
    $('.clipSpan').css("margin-top", "0px");
    clipStartingHeight = 0;
    levelOffset -= 3;
  }
  else {
    // Change the styling to fit better
    $('.clipSpan').css("margin-top", "15px");
  }

  $("#downloadCsv").click( function() {
    downloadCSV(csvData, $("#sessionSelector").val());
  });

  // Handle the 'run visualization' command
  $("#getInfo").click( function() {
    console.log("Fetching segment info...");

    // Make sure we have both of the needed values
    if(  $("#sessionSelector").val() == '' ) {
      alert("Cannot complete request: Session information missing!");
    }
    else {
      $('#visContainer').html("Loading...");

      // Reset / set the fail timer
      if( failTimeoutH != null ) { clearTimeout(failTimeoutH); }
      failTimeoutH = setTimeout( function() {
        if( segsLeft > 0 ) {
          $('#visContainer').html("Loading is taking longer than expected  =(");
        }
      }, failTimeoutLen);
 
      // Call the server for info!
      $.ajax({
        url: "php/getClips.php",
        aync: false,
        type: "POST",  // To ensure refresh in IE
        data: {session: $("#sessionSelector").val()}, //, clipIndex: $("#clipIdxSelector").val()},
        dataType: "text",
        success: function(c) {
          // Call the visualiztion function on success

          // Clear the visualization div
          $('#detailContainer').html('');
          $('#simpleContainer').html('');
          //$('#visContainer').html('');
          $('#statsContainer').html('');


          // Create the visualization (using both levels of detail), then populate the right one
          //clipDivArray = createClipDivs(c, $('#visContainer'));
//console.log("STARTING FALSE...")
          // If we're using the simplified view, load the second version of the data
          if( !g_useDetails ) {
              var clipDivArray = createClipDivs(c, $('#simpleContainer'), false);  // Without details
              getAnswers(clipDivArray, false);
          }

//console.log("STARTING TRUE...")
          clipDivArray = createClipDivs(c, $('#detailContainer'), true);  // With details
          getAnswers(clipDivArray, true);



/////////////// getAnswers was here.


        if( !embed ) {
          $("#scanning-stats_area").html('');
          postStats("scanning", $("#sessionSelector").val(), "findSegments_scanning.rb", 'default', '#f80');

          $("#scanning_jac-stats_area").html('');
          postStats("scanning_jac", $("#sessionSelector").val(), "findSegments_scanning.rb", 'jaccard', '#f00');

          $("#scanning_f1-stats_area").html('');
          postStats("scanning_f1", $("#sessionSelector").val(), "findSegments_scanning.rb", 'f1', '#fd0');

          $("#scanning_noem-stats_area").html('');
          postStats("scanning_noem", $("#sessionSelector").val(), "findSegments_scanning.rb", 'noem', '#000');

          $("#scanning_kmeans-stats_area").html('');
          postStats("scanning_kmeans", $("#sessionSelector").val(), "findSegments_scanning.rb", 'kmeans', '#fff');

          $("#simple-stats_area").html('');
          postStats("simple", $("#sessionSelector").val(), "findSegments_simpleRules.rb", '', '#f0f');
        }

        },
        failed: function(){
          // Let the user know we failed to get their information
          alert("Fetching info failed 4 =(");
        }
      });


    }
  });

  // Handle Enter as a way to run the visualization
  $('#sessionSelector').keypress( function(e) {
    if( e.which == 13 ) {
      $('#getInfo').click();
    }
  });


  // If we passed in a session, run the tool once to begin with, and populate the session input box
  if( gup("session") ) {
    // 
    $('#sessionSelector').val(gup("session"));
    $('#getInfo').click();
  }



  console.log("Ready!");


});
