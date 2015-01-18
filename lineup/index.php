<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 101 Template</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>

    <script src="scripts/mturk.js" type="text/javascript"></script>
    <script src="//roc.cs.rochester.edu/LegionJS/LegionTools/LegionJS_Libraries/vars.js"></script>
    <script src="//roc.cs.rochester.edu/LegionJS/LegionTools/LegionJS_Libraries/legion.js"></script>
    <link rel="stylesheet" href="//roc.cs.rochester.edu/LegionJS/LegionTools/LegionJS_Libraries/legion.css">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="style/style.css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div id = "bodyWrapper">
    <div id="lineupDiv">
    <div class="container-fluid">
      <div class="row">
      <h1 id="instructionsTitle">Did you see any of these people in the previous video? Click yes on the corresponding image if you are sure that you saw them, and no otherwise.</h1>
        <div class="col-md-offset-4">
        </div>
      </div>
      <form id="lineupForm">
        <div class="row js-lineup">
        </div>
        <div class="row">
          <div class="col-md-offset-5">
            <button type="submit" id="submitLineup" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>
    </div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="scripts/page.js"></script>
    <script>
      var LINEUP = {
        session: '<?php echo $_GET["session"]; ?>'
      }
    </script>
    </div>

    <div id="multipleChoiceDiv" style = "padding-left:20px;">
    <span id="question"><h3></h3></span>
    <form id="answers"></form>
    <button type="submit" id="submitMultipleChoice" class="btn btn-primary">Submit</button>
    </div>
    </div>

    <form id="mturk_form"></form>
    <div id="instructions"></div>
    <!-- Include all compiled plugins (below), or include individual files as needed -->

  </body>
</html>