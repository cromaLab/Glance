$(document).ready(function(){
    $("#multipleChoiceDiv").hide();
    $("#submitLineup").text("Click 'yes' or 'no' on all images");
    $("#submitLineup").attr("disabled", "disabled");
    var showSubmitButton = gup("submit");
    if(showSubmitButton == "true"){
        $("#bodyWrapper").empty();
        $("#legion-submit").removeAttr("disabled");
        $("#legion-submit").show();
    }
    else{
        var folders;
        var numTotal;

        var finished = [];

        if(gup("folderNum") == "") var folderNum = 0;
        else var folderNum = gup("folderNum");

        console.log(gup("session"));
        var sess = gup("session");

        $.ajax({
            type: "POST",
            url: 'php/getFolders.php',
            async: false,
            dataType: "text",
            data: { session: gup("session") },
            success: function (d) {
                console.log(d);
                folders = d.split(",");
                numTotal = folders.length;
            }
        });

        console.log(folders);

        var folderToUse = folders[folderNum];

        $("#submit-div").hide();
        $("#legion-submit-instructions").hide();
        $("#legion-submit").hide();

        $("#lineupDiv").show();

        console.log(folderToUse);
        var images = getImages(folderToUse);
        console.log(images);

        createLineup(images);

        $(".lineupInput").click(function(event) {
            var name = event.target.name;
            if(finished.indexOf(name) < 0){
                finished.push(name);
            }
            if(finished.length >= images.length){
                $("#submitLineup").text("Submit");
                $("#submitLineup").removeAttr("disabled");
            }
        });

        $("#submitLineup").on("click", function(){
            event.preventDefault();
            $("#submitLineup").attr("disabled", "disabled");
            resultsArray = $('#lineupForm').serializeArray();
            for(var i = 0; i < resultsArray.length - 1; i = i + 2){
                answer = resultsArray[i].value;
                picture = resultsArray[i + 1].value;
                console.log(answer + " " + picture);
                $.ajax({
                    type: "POST",
                    url: 'php/log.php',
                    async: false,
                    dataType: "text",
                    // data: { answer: answer, question: picture, session: folderToUse, workerId: gup("workerId"), setupId: gup("setupId"), clipIndex: gup("clipIndex") },
                    data: { answer: answer, question: picture, session: gup("session"), workerId: gup("workerId"), setupId: gup("setupId"), clipIndex: gup("clipIndex") },
                    success: function (d) {
                    }
                });
            }

            $("#submitLineup").attr("disabled", "disabled");
            url = "index.php";

            url += "?setupId=" + gup("setupId");
            url += "&turkSubmitTo=" + gup("turkSubmitTo");
            url += "&workerId=" + gup("workerId");
            url += "&assignmentId=" + gup("assignmentId");
            url += "&hitId=" + gup("hitId");
            url += "&mode=" + gup("mode");
            url += "&session=" + gup("session");
            url += "&folderNum=" + ++folderNum;
            if(folderNum >= folders.length) url += "&submit=" + "true";

            setTimeout(function(){window.location = url;},1000);

        });
    }
});
 
function getImages(session){
    var images;
    $.ajax({
        type: "POST",
        url: 'php/getImages.php',
        async: false,
        dataType: "json",
        data: { session: session },
        success: function (d) {
            images = d;
        }
    });
    return images;
}

var createLineup = function(images) {
    var $lineup = $('.js-lineup');    
    for (var i = 0; i < images.length; i++) {
        var $wrapper = $('<div id = "imagesWrapper" class="col-md-2"></div>')
        var $radioWrapper = $('<div class="row"></div>');
        var $radioYes = $('<div class="col-md-6">'
                        +   '<div class="radio">'
                        +   '<label>'
                        +       '<input class = "lineupInput" type="radio" name="personKnown[' + i  + ']" value="true">'
                        +        'Yes'
                        +   '</label>'
                        +   '</div>'
                        + '</div>');
        var $radioNo =  $('<div class="col-md-6">'
                        +   '<div class="radio">'
                        +   '<label>'
                        +        '<input class = "lineupInput" type="radio" name="personKnown[' + i  + ']" value="false">'
                        +       'No'
                        +   '</label>'
                        +   '</div>'
                        +  '</div>');

        $radioWrapper.append($radioYes);
        $radioWrapper.append($radioNo);
        $wrapper.append('<img class="lineup-photo" src="' + images[i] + '">');        
        $wrapper.append($radioWrapper);
        $wrapper.append('<input type="hidden" name="imageName[' + i + ']" value="' + getFileName(images[i]) + '">')
        $lineup.append($wrapper);
    }
    
};

function createMultipleChoice(){
    var choices = [];

    if(gup("session").match(/cc/g) != null){
        $("#question h3").text("What kind of card did you see in the photo?")
        choices.push("An ID card");
        choices.push("A credit card");
        choices.push("A playing card");
        choices.push("A gift card");
        choices.push("A library card");
    }

    if(gup("session").match(/face/g) != null){
        $("#question h3").text("What did you see a portion of in the photo?")
        choices.push("An animal");
        choices.push("A chest");
        choices.push("An arm");
        choices.push("A face");
    }

    choices = shuffle(choices);

    for(var i = 0; i < choices.length; i++){
        $("#answers").append('<div class="radio"> <label> <input type="radio" name="optionsRadios" value="' + choices[i] + '" checked>' + choices[i] + '</label> </div>');
    }

}

var getFileName = function(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
};

// function for getting URL parameters
function gup(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null)
        return "";
    else
        return unescape(results[1]);
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};