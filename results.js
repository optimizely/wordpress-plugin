
function optimizelyResultsPage(apiToken,projectId,poweredVisitor) {
	 var $ = jQuery;

	 var optly = new OptimizelyAPI(apiToken);  

  	//fetch only Wordpress experiments from project
  	optly.get('projects/' + projectId + '/experiments/', function(response) {
  		optly.wordpressExps = [];
      var counter = 0;
  		for (i=0; i<response.length; i++) {
  			if (response[i].description.indexOf('Wordpress') > -1 && response[i].status != 'Archived' && response[i].status != 'Draft') {
  				getWPExpResults(response[i],function(exp){
  					displayResultsList(exp,i,function(){
              showGoalSelected(exp.id);
              addSelectChange(exp.id);
            });
  				});
  			}
  		}
  	});

  	//launch winning variation when Launch button is clicked
  	$("html").delegate(".launch", 'click', function() {
      var loserVars = [];
      $(this).parents('.opt_results').find(".variationrow:visible:not('.winner')").each(function() {
        loserVars.push($(this).attr('data-var-id'));
        launchWinner(loserVars);
    });
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


  function addSelectChange(expId){ 
    $('#goal_'+expId).bind('change', function(){ 
      showGoalSelected(expId);
    });
  } 

    function compare(a,b) {
      if (a.goal_name < b.goal_name)
         return -1;
      if (a.goal_name > b.goal_name)
        return 1;
      return 0;
    }
  	function getWPExpResults(expObj,cb) {
  		expObj.results = [];
  		optly.get('experiments/' + expObj.id + '/results', function(response) { 
        var goalNameArray = [];
        response.sort(compare);
        expObj.results = response;
  			cb(expObj);
  		});
  	}


  	function launchWinner(loserArray) {
  		for (i=0; i<loserArray.length; i++) {
  			optly.patch('variations/' + loserArray[i], {'is_paused': true}, function(response) {
  				console.log('just launched winner');
        		optly.variation = response;
        		optly.variation.expName = $('tr[data-var-id="'+optly.variation.id+'"]').parents('.opt_results').attr('data-exp-title');
        		//function to update UI
      		});
  		}

  	}

  	function pauseExperiment(experimentID) {
    	optly.patch('experiments/' + experimentID, {'status': 'Paused'}, function(response) {
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".pause").removeClass("pause").addClass("play");
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".fa-pause").removeClass("fa-pause").addClass("fa-play");
    	});
    }

    function startExperiment(experimentID) {
    	optly.patch('experiments/' + experimentID, {'status': 'Running'}, function(response) {
    		$(".opt_results[data-exp-id="+ experimentID +"]").find(".play").removeClass("play").addClass("pause");
      		$(".opt_results[data-exp-id="+ experimentID +"]").find(".fa-play").removeClass("fa-play").addClass("fa-pause");
      	});
    }

    function archiveExperiment(experimentID) {
    	optly.patch('experiments/'+ experimentID, {'status': 'Archived'}, function(response) {
    		$(".opt_results[data-exp-id="+ experimentID +"]").hide();
    	});
    }

  	function displayResultsList(exp,i,cb) {
  		$('.loading').hide();
  		$('#results_list').append(buildResultsModuleHTML(exp));
      animateProgressBar(exp);
      cb();
  	}

    function getAverageVisitor(results){
      var totalVisitors = 0;
      for(var i=0;i < results.length;i++){
        totalVisitors += results[i].visitors;
      }

      return totalVisitors/results.length;
    }

    function animateProgressBar(exp){
      var progressbar = $('#exp_'+exp.id).find('.progressbar');
      var averageVisitorPerVariation = getAverageVisitor(exp.results),
      //var averageVisitorPerVariation = Math.floor((Math.random() * 20000) + 1),
          poweredPercentage = Math.round((averageVisitorPerVariation/poweredVisitor)*100);
      progressbar.progressbar({
        value: averageVisitorPerVariation,
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
      $(progressbar).attr('title',Math.round(averageVisitorPerVariation)+' / '+poweredVisitor+' visitors');

      if(checkIfOriginalIsWinner(exp.results,averageVisitorPerVariation)){

      }
    }

    function getRoundedPercentage(num){
      return (num*100).toFixed(2)+"%";
    }

    function getBaselineID(results){
      for(var i=0;i<results.length;i++){
        if(results[i].status == 'baseline'){
          return results[i].variation_id;
        }
      }

      return 0;
    }

    function showGoalSelected(expID){
      $('#exp_'+expID).find('.variationrow').hide();
      var goalClass = $('#goal_'+expID).val();
      $('#exp_'+expID).find('.'+goalClass).show();

    }
    function checkIfOriginalIsWinner(results,avgVisitor){
      var origVarId = 0;
      for(var i=0;i<results.length;i++){
        if(results[i].improvement > 0 && avgVisitor > poweredVisitor){
          return false;
        }
      }
      return true;
    }

    function getReadyButton(isWinner,avgVisitors,results){
      if(isWinner){
        // Show Launch Button
        return '<div class="ready launch button"><i class="fa fa-rocket fa-fw"></i> <span>Launch Winner!</span></div>';
      }else if(avgVisitors >= poweredVisitor && checkIfOriginalIsWinner(results,avgVisitors)){
        var baselineid = getBaselineID(results);
        $('#variation_'+baselineid).attr('class','winner');
        return '<div class="ready"><i class="fa fa-question-circle fa-fw"></i> <span>Original Winner</span></div>';
      }else if(avgVisitors >= poweredVisitor){
        return '<div class="ready"><i class="fa fa-question-circle fa-fw"></i> <span>Inconclusive</span></div>';
      }else{
        return '<div class="ready"><i class="fa fa-clock-o fa-fw"></i> <span>Not Ready Yet!</span></div>';
      }
      
    }


  	function buildResultsModuleHTML(exp) {
  		// Set the checkbox html
  		var statusClass = 'play';
  		if(exp.status == "Running"){
  			statusClass = 'pause';
  		}
      var expTitle = exp.description;
      if(expTitle.length > 73){
        expTitle = expTitle.substring(0,72)+'...';
      }
	    var html = ""+
	    '<div id="exp_'+exp.id+'" data-exp-id="'+exp.id+'" class="opt_results" data-exp-title="'+exp.description+'">'+
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
                    if(result.status == "winner"){
                      isWinner = true;
                    }
                  	html = html+
                  	'<tr class="variationrow '+result.status+' '+result.goal_id+'" id="variation_'+result.variation_id+'" data-var-id="'+result.variation_id+'">'+
                        '<td class="first"><a target="_blank" href="'+exp.edit_url+ '?optimizely_x' +exp.id+ '='+result.variation_id+'">'+result.variation_name+'</a></td>'+
                        '<td>'+result.visitors+'</td>'+
                        '<td>'+result.conversions+'</td>'+
                        '<td>'+getRoundedPercentage(result.conversion_rate)+'</td>'+
                        '<td>'+improvement+'</td>'+
                        '<td>'+confidence+'</td>'+
                    '</tr>';
                  }
                  html = html+
              '</table>'+
          '</div>'+
          '<div class="footer">'+
              '<div class="progressbar"></div>'+
                getReadyButton(isWinner,avgVisitors,exp.results)+
          '</div>'+
      '</div>';
      return html;
	}

}