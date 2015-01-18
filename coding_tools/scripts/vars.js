var pointsPerDollar = 20000;
var pointMapping = {"hit": 100};
var min_money = 0.02; //minimum amount of money earned to allow submission

var player;

var submittableTime = false;
var submittablePlayer = false;

var useRetainerTool = false; //set to true if the retainer tool is used.
var getTimeWaitedURL = "../Retainer/php/getTimeWaited.php"; //the URL of the tool to get the time a worker has waited in the retainer tool.
var centsPerSecondWaited = .05; //the numbers of cents to award the worker for each second waited.

var submitInstructionsText = "";//"The HIT is now over. Please submit it for payment. If the button below is disabled, then you did not accumulate enough money to be paid.";

//contains URL parameters.
var Control = {
usePoints: false, //if "points=true" then the point system will be used. 
useAnim: false, //if "anim=true" then animation will be used. 
useCorrect: false, //if "correct=true" then the variable "useCorrect" will be set to true. You may use this in your project to determine if workers should be given differing point amounts that depend on their performance.

init: function() {
	Control.usePoints = gup('points') == 'true' ? true : false;
	Control.useAnim = gup('anim') == 'true' ? true : false;
	Control.useCorrect = gup('correct') == 'true' ? true : false;

	// LegionJS TESTING: This controls the appearance of the score box 
	if( !Control.usePoints ) {
		// Then hide the scorebox
		$('#legion-score').hide();
	}

},


    
}

$(document).ready(function() {
    Control.init();
});
