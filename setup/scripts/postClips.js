function postClips(newPercent, session, depth){
    var initialStartTime; //will store initial start time
    var initialEndTime; //will store initial end time
    var clipLength; //will store lengh of clip to use for sampling
    var mturk; //will store how to use mturk
    var action;
    var description;
    var trial;
    var clipStartingTime; //the example clip
    var clipEndingTime; //the example clip

    var indicesSubmittedForLabeleing = []; //will hold all indicies that were submitted by getAnswers for labeleing

    //gets neccesary session info
    $.ajax({
        dataType: "json",
        async: false,
        url: "php/getDBRow.php",
        data: {session: session}, //uses session to get correct row
        success: function(d) {
         var dbRow = d;
         initialStartTime = parseFloat(dbRow[0].initialStart);
         initialEndTime = parseFloat(dbRow[0].initialEnd);
         clipLength = parseFloat(dbRow[0].clipLength)
         mturk = dbRow[0].mturk;
         action = dbRow[0].action;
         description = dbRow[0].description;
         trial = dbRow[0].trial;
        clipStartingTime = dbRow[0].clipStart;
        clipEndingTime = dbRow[0].clipEnd;
        },
        fail: function(){
          alert("Failed to get row from db");
        }
      });

    var videoLength = initialEndTime - initialStartTime; //calculates lenght of entire video
    var numClips = Math.floor(videoLength/clipLength); //number of possible clips
    //alert("numClips: " + numClips);

    var clipsLabeled = new Array(); //will contain clips that have already been labeled
    //gets all indicies of clips that have already been labeled
    $.ajax({
        type: "GET",
        async: false,
        url: "php/getUsedSegments.php",
        data: {session: session},
        success: function(d){
            var json = JSON.parse(d);
            for(var i = 0; i < json.length; i++){
                clipsLabeled.push(parseFloat(json[i].clipIndex)); //adds all clip indicies that have already been labeled
            }
        },
        fail: function(){
          alert("Failed to get row from db");
        }
    });

    var clipsToLabel = new Array();
    for(var i = 0; i < numClips; i++){
        if (jQuery.inArray(i, clipsLabeled) == -1){
            clipsToLabel.push(parseFloat(i)); //if the index is not already labeled, add it to the last of indicies that can be labeled
        }
    }
    
    clipsToLabel.sort(compareNumbers);
    // alert("clipstolabel: " + clipsToLabel);

    //gets and updates percent in db
    var oldPercent;
    $.ajax({
        type: "GET",
        async: false,
        url: "php/updatePercentSampled.php",
        data: {session: session, percent: newPercent},
        success: function(d) {
            oldPercent = d;
            //alert("oldPercent: " + oldPercent);
        },
        fail: function(){
          alert("Failed to add get/add percent");
        }
    });

    var percentToAdd = newPercent - oldPercent; //additional % of clip to sample

    if(percentToAdd <= 0){ //checks if the user chose a percent higher than the current total percent done
        alert("Please choose a higher percent.");
        return;
    }

    var numToAdd = percentToAdd *.01 * numClips; //number of new clips to label
    //alert("numToAdd: " + numToAdd);

    var increment = Math.ceil(clipsToLabel.length / numToAdd); //label every nth clip of the remaining clips that can be labeled
    //alert("increment: " +  increment);

    var j = 0;
    for(var i = 0; j < numToAdd && i < clipsToLabel.length; i = i + increment){
        var setupId; //will store setupId of row just inserted
        var clipIndexToLabel = clipsToLabel[i];//gets index of clip to label
        indicesSubmittedForLabeleing.push(clipIndexToLabel);
        j++;
        var start = initialStartTime + clipIndexToLabel * clipLength; //calculates start time of clip
        var end = start + clipLength;
        //posts info to add to db
        // alert(clipIndexToLabel);
        $.ajax({
            type: "POST",
            async: false,
            url: "php/addDbRow.php",
            data: {session: session, start: start, end: end, clipStart: clipStartingTime, clipEnd: clipEndingTime, videoId: videoId, action: action, description: description, trial: trial, clipIndex: clipIndexToLabel, mturk: mturk, clipLength: clipLength, initialStart: initialStartTime, initialEnd: initialEndTime},
            success: function(d) {
                setupId = d;
                //alert("setupId: " + setupId);
            },
            fail: function(){
              alert("Failed to add row to db");
            }
        });

        $.ajax({
            type: "POST",
            async: false,
            url: "php/addRouterRow.php",
            data: {session: session, setupId: setupId, clipIndex: clipIndexToLabel, max: depth},
            success: function(d) {
                
            },
            fail: function(){
              alert("Failed to add row to router");
            }
        });

    }

    // //starts getAnswers and records PID
    // if(mturk != "None"){
    //     if(mturk == "Live") var isSandbox = false;
    //     else var isSandbox = true;
    //     //calls php to start getAnswers.py
    //     $.ajax({
    //         type: "POST",
    //         url: "startGetAnswers.php",
    //         data: {setupId: setupId, isSandbox: isSandbox, depth: depth},
    //         success: function(data) {
    //             var pid = data;
    //             pids[session].push(pid); //logs PID
    //         },
    //         fail: function(){
    //           alert("Failed to start getAnswers");
    //         }
    //     });
    // }

    // function checkIfCanEnableRaiseControl(buttonNum){

    //     // var tabIndex = jQuery.inArray(session, sessions);

    //     //checks if we can enable raising the sampling percent
    //     // var enableNewSampleCheck = setInterval(function(){
    //         $('#raiseSampleButton').html("Wait!");
    //         var clipsLabeled = new Array(); //will contain clips that have already been labeled
    //         //gets all indicies of clips that have already been labeled
    //         $.ajax({
    //             type: "GET",
    //             async: false,
    //             url: "php/getUsedSegments.php",
    //             data: {session: sessions[buttonNum]},
    //             success: function(d){
    //                 var json = JSON.parse(d);
    //                 for(var i = 0; i < json.length; i++){
    //                     clipsLabeled.push(parseFloat(json[i].clipIndex)); //adds all clip indicies that have already been labeled
    //                 }
    //             },
    //             fail: function(){
    //               alert("Failed to get row from db");
    //             }
    //         });

    //         var allPresent = true;
    //         for(var i = 0; i < indicesSubmittedForLabeleing.length; i++){
    //             if (jQuery.inArray(indicesSubmittedForLabeleing[i], clipsLabeled) == -1) allPresent = false;
    //         }
    //         //if at least 1 worker has submitted results for all clips, allow the user to raise the sampling percent
    //         if(allPresent){
    //             tabIndex = jQuery.inArray(session, sessions);
    //             $('#sampleSelect').removeAttr("disabled");
    //             $('#sampleDepth').removeAttr("disabled");
    //             $('#sampleButton').removeAttr("disabled");
    //             $('#sampleButton').html("Go!");

    //             window.clearInterval(enableNewSampleCheck);
    //         }
    //     // },3000);
    // }

}

function compareNumbers(a, b) //used for sorting
{
    return a - b;
}