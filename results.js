
function optimizelyResultsPage(apiToken,projectId,poweredVisitor) {
	 var $ = jQuery;

	 var optly = new OptimizelyAPI(apiToken);  

  	//fetch only Wordpress experiments from project
  	optly.get('projects/' + projectId + '/experiments/', function(response) {
  		optly.wordpressExps = [];
      var resultsArray = [];
      for (i=0; i<response.length; i++) {
        if (response[i].description.indexOf('Wordpress') > -1 && response[i].status != 'Archived' && response[i].status != 'Not started' && response[i].status != 'Draft') {
          resultsArray.push(response[i]);
        }
        
      }
      if(resultsArray.length > 0){
        for (i=0; i<resultsArray.length; i++) {
          getWPExpResults(resultsArray[i],function(exp){
            displayResultsList(exp,i,function(){
              showGoalSelected(exp.id);
              addSelectChange(exp.id);
            });
          });
        }
      }else{
        $('#noresults').show();
        $('#loading').hide();
        $('#ready').hide();
      }
  	});


  //pause experiment when pause button is pressed
  $("html").delegate(".pause", 'click', function() {
    var expID = $(this).parents('.opt_results').attr("data-exp-id");
    pauseExperiment(expID);
  });
  //start experiment when play button is pressed
  $("html").delegate(".play", 'click', function() {
    var expID = $(this).parents('.opt_results').attr("data-exp-id");
    startExperiment(expID);
  });
  //archive experiment when archive button is pressed
  $("html").delegate(".archive", 'click', function() {
    var expID = $(this).parents('.opt_results').attr("data-exp-id");
    archiveExperiment(expID);
  });

  $("html").delegate(".fullresults", 'click', function() {
    var expID = $(this).parents('.opt_results').attr("data-exp-id");
    window.open('https://www.optimizely.com/results2?experiment_id='+expID)
  });

  //launch winning variation when Launch button is clicked
  $("html").delegate(".launch", 'click', function() {
    var winningVarName = $(this).parents('td').siblings('.first').children('a').text();
    var expID = $(this).parents('.opt_results').attr("data-exp-id");
    var expTitle = $(this).parents('.opt_results').attr("data-exp-title");
    launchWinner(expID,expTitle,winningVarName);
  });

  // changes the results for the goal selected
  function addSelectChange(expId){ 
    $('#goal_'+expId).bind('change', function(){ 
      showGoalSelected(expId);
    });
  } 

    // Simple compare function to sort goals by name
    function compare(a,b) {
      if (a.goal_name < b.goal_name)
         return -1;
      if (a.goal_name > b.goal_name)
        return 1;
      return 0;
    }

    // Gets the results for the experiment
  	function getWPExpResults(expObj,cb) {
  		expObj.results = [];
  		optly.get('experiments/' + expObj.id + '/results', function(response) { 
        var goalNameArray = [];
        response.sort(compare);
        expObj.results = response;
        expObj.avgVisitorCount = getAverageVisitor(expObj.results);
  			cb(expObj);
  		});
  	}

    // AJAX function that updates the title in Wordpress
    function launchWinner(expID, expTitle, winningVarName){
      // Get the ID of the Wordpress post
      var wpPostID = expTitle.substring(11,expTitle.indexOf(']'));
      var data = {
        action: "update_post_title",
        post_id: wpPostID,
        title: winningVarName
      };

      $.post(wpAjaxUrl, data, function(){
          $('#exp_'+expID).fadeOut(1000,function(){
            $('#successMessage').html('<h3>You have succesfully launched the new headline</h3> Old Headline: '+expTitle+'<br>New Headline: '+winningVarName);
            $('#successMessage').show();
            // Archive the Experiement
            archiveExperiment(expID);
          });
      });
    }

    // Pause Experiment
  	function pauseExperiment(experimentID) {
    	optly.patch('experiments/' + experimentID, {'status': 'Paused'}, function(response) {
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".pause").removeClass("pause").addClass("play");
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".fa-pause").removeClass("fa-pause").addClass("fa-play");
    	});
    }

    // Start Experiment
    function startExperiment(experimentID) {
    	optly.patch('experiments/' + experimentID, {'status': 'Running'}, function(response) {
    		$(".opt_results[data-exp-id="+ experimentID +"]").find(".play").removeClass("play").addClass("pause");
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".fa-play").removeClass("fa-play").addClass("fa-pause");
      	});
    }

    // Archive Experiment
    function archiveExperiment(experimentID) {
    	optly.patch('experiments/'+ experimentID, {'status': 'Archived'}, function(response) {
    		$(".opt_results[data-exp-id="+ experimentID +"]").hide();
    	});
    }

    // Will display the resutls and build the HTML
  	function displayResultsList(exp,i,cb) {
  		$('.loading').hide();
      var html = buildResultsModuleHTML(exp);
      if(exp.avgVisitorCount > poweredVisitor){
        $('#ready').show();
        $('#ready').append(html);
      }else{
        $('#stillwaiting').show();
        $('#stillwaiting').append(html);
      }

      animateProgressBar(exp);
      cb();
  	}

    // Loops through the variations and gets an average of the visitor count for powered testing
    function getAverageVisitor(results){
      var totalVisitors = 0;
      for(var i=0;i < results.length;i++){
        totalVisitors += results[i].visitors;
      }

      return totalVisitors/results.length;
    }

    // Uses the average visitor count to create the progress bar
    function animateProgressBar(exp){
      var progressbar = $('#exp_'+exp.id).find('.progressbar'),
          poweredPercentage = Math.round((exp.avgVisitorCount/poweredVisitor)*100);
      progressbar.progressbar({
        value: exp.avgVisitorCount,
        max: poweredVisitor
      });

      var progBarColor;
      switch(true){
        case (poweredPercentage < 25):
          progBarColor = "#FF0000";
          break;
        case (poweredPercentage >= 25 && poweredPercentage < 50):
          progBarColor = "#FB7948";
          break;
        case (poweredPercentage >= 50 && poweredPercentage < 75):
          progBarColor = "#FBA92F";
          break;
        case (poweredPercentage >= 75 && poweredPercentage < 100):
          progBarColor = "#CFF43B";
          break;
        default:
          progBarColor = "#90b71c";
          break;
      }

      $(progressbar).find('.ui-progressbar-value').css({'background':progBarColor,'border':'1px solid '+progBarColor});
      $(progressbar).attr('title',Math.round(exp.avgVisitorCount)+' / '+poweredVisitor+' visitors');
    }

    // Used to convert the value returned by the results API to a rounded percentage
    function getRoundedPercentage(num){
      return (num*100).toFixed(2)+"%";
    }

    // Changes the goal results based on what is selcted
    function showGoalSelected(expID){
      $('#exp_'+expID).find('.variationrow').hide();
      var goalClass = $('#goal_'+expID).val();
      $('#exp_'+expID).find('.'+goalClass).show();

    }
    
    // Main function that builds the HTNML for each results block
  	function buildResultsModuleHTML(exp) {
  		// Set the checkbox html
  		var statusClass = 'play';
  		if(exp.status == "Running"){
  			statusClass = 'pause';
  		}
      var expTitle = exp.description;
      expTitle = expTitle.substring(expTitle.indexOf(']:')+3);
      if(expTitle.length > 73){
        expTitle = expTitle.substring(0,72)+'...';
      }
	    var html = ""+
	    '<div name="'+exp.id+'" id="exp_'+exp.id+'" data-exp-id="'+exp.id+'" class="opt_results" data-exp-title="'+exp.description+'">'+
          '<div class="header">'+
              '<div class="title">'+expTitle+'</div>'+
              '<div class="results_toolbar">'+
                  '<select class="goalSelector" id="goal_'+exp.id+'">';
                    var goalIdArray = [];
                    for(var i = 0;i <exp.results.length;i++){
                      var result = exp.results[i];
                      console.log($.inArray(goalIdArray,result.goal_id));
                      var selected = '';
                      if(goalIdArray.indexOf(result.goal_id) == -1){
                        if(result.goal_name == 'Views to page'){
                          selected = 'selected';
                        }
                        html += '<option value="'+result.goal_id+'" '+selected+'>'+result.goal_name+'</option>';
                        goalIdArray.push(result.goal_id);
                      } 
                    }
                    html +=
                  '</select>'+
                  '<div title="Start Experiment" class="'+statusClass+' button">'+
                      '<i class="fa fa-'+statusClass+' fa-fw"></i>'+
                  '</div>'+
                  '<a href="https://www.optimizely.com/edit?experiment_id='+exp.id+'" target="_new">'+
                      '<div title="Edit on Optimizely" class="edit button">'+
                          '<i class="fa fa-edit fa-fw"></i>'+
                      '</div>'+
                  '</a>'+
                  '<div title="Full Results" class="fullresults button">'+
                      '<i class="fa fa-line-chart fa=fw"></i>'+
                  '</div>'+
                  '<div title="Archive Experiment" class="archive button">'+
                      '<i class="fa fa-archive fa=fw"></i>'+
                  '</div>'+
              '</div>'+
          '</div>'+
          '<div class="variations">'+
              '<table>'+
                  '<tr class="first">'+
                      '<th class="first">VARIATION</th>'+
                      '<th>VISITORS</th>'+
                      '<th>CONVERSIONS</th>'+
                      '<th>CONVERSION RATE</th>'+
                      '<th>IMPROVEMENT</th>'+
                      '<th>CONFIDENCE</th>'+
                      '<th>LAUNCH</th>'+
                  '</tr>';
                  var isWinner = false;
                  for(i=exp.results.length -1;i >= 0;i--){
                  	var result = exp.results[i],
                        improvement,
                        conversion_rate,
                        avgVisitors = getAverageVisitor(exp.results),
                        confidence;
                    if(result.status == "baseline"){
                      improvement = 'baseline';
                      confidence = '-';
                    }else{
                      confidence = getRoundedPercentage(result.confidence);
                      improvement = getRoundedPercentage(result.improvement);
                    }
                  	html = html+
                  	'<tr class="variationrow '+result.status+' '+result.goal_id+'" id="variation_'+result.variation_id+'" data-var-id="'+result.variation_id+'">'+
                        '<td class="first"><a target="_blank" href="'+exp.edit_url+ '?optimizely_x' +exp.id+ '='+result.variation_id+'">'+result.variation_name+'</a></td>'+
                        '<td>'+result.visitors+'</td>'+
                        '<td>'+result.conversions+'</td>'+
                        '<td>'+getRoundedPercentage(result.conversion_rate)+'</td>'+
                        '<td>'+improvement+'</td>'+
                        '<td>'+confidence+'</td>'+
                        '<td>';
                          if(result.status != 'baseline'){
                            html += '<div class="button launch '+result.status+'" title="Launch"><i class="fa fa-rocket fa-fw"></i></div>';
                          }
                          
                        html +='</td>'+
                    '</tr>';
                  }
                  html = html+
              '</table>'+
          '</div>'+
          '<div class="footer">'+
              '<div class="progressbar"></div>'+
          '</div>'+
      '</div>';
      return html;
	}

}