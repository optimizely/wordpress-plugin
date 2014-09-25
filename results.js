
function optimizelyResultsPage(apiToken,projectId,poweredVisitor) {
	 var $ = jQuery;

	 var optly = new OptimizelyAPI(apiToken);  

  	//fetch only Wordpress experiments from project
  	optly.get('projects/' + projectId + '/experiments/', function(response) {
  		optly.wordpressExps = [];
  		for (i=0; i<response.length; i++) {
  			if (response[i].description.indexOf('Wordpress') > -1 && response[i].status != 'Archived' && response[i].status != 'Draft') {
  				getWPExpResults(response[i],function(exp){
  					displayResultsList(exp,i);
  				});
  			}
  		}
  	});

  	//launch winning variation when Launch button is clicked
  $("html").delegate(".launch", 'click', function() {
      var loserVars = [];
      $(this).parents('.opt_results').find("tr:not('.winner')").each(function() {  //[NEED] loser class or use "tr:not('.winner')""
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
  })

  	function getWPExpResults(expObj,cb) {
  		expObj.results = [];
  		optly.get('experiments/' + expObj.id + '/results', function(response) { 
  			for(i=0;i < response.length;i++){
  				var result = response[i];
  				if(result.goal_name.indexOf('Views to page') > -1){
  					expObj.results.push(result);
  				}
  			}
  			cb(expObj);
  		});
  	}


  	function launchWinner(loserArray) {
  		for (i=0; i<loserArray.length; i++) {
  			optly.patch('variations/' + loserArray[i], {'is_paused': 'true'}, function(response) {
        			optly.experiment = response;
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

  	function displayResultsList(exp,i) {
  		$('.loading').hide();
  		$('#results_list').append(buildResultsModuleHTML(exp));
      animateProgressBar(exp);
      
  	}

    function getAverageVisitor(results){
      debugger;
      var totalVisitors = 0;
      for(var i=0;i < results.length;i++){
        totalVisitors += results[i].visitors;
      }

      return totalVisitors/results.length;
    }

    function animateProgressBar(exp){
      var progressbar = $('#exp_'+exp.id).find('.progressbar');
      //var averageVisitorPerVariation = getAverageVisitor(exp.results);
      var averageVisitorPerVariation = Math.floor((Math.random() * 20000) + 1),
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

      if(averageVisitorPerVariation >= poweredVisitor){
        $('.ready').addClass('launch button');
        $('.ready > i').attr('class','fa fa-rocket fa-fw');
        $('.ready > span').text('Launch!');
      }
    }


  	function buildResultsModuleHTML(exp) {
  		// Set the checkbox html
  		var statusClass = 'play';
  		if(exp.status == "Running"){
  			statusClass = 'pause';
  		}

	    var html = ""+
	    '<div id="exp_'+exp.id+'" data-exp-id="'+exp.id+'" class="opt_results">'+
          '<div class="header">'+
              '<div class="title">'+exp.description+'</div>'+
              '<div class="results_toolbar">'+
                  '<div title="Start Experiment" class="'+statusClass+' button">'+
                      '<i class="fa fa-'+statusClass+' fa-fw"></i>'+
                  '</div>'+
                  '<a href="https://www.optimizely.com/edit?experiment_id='+exp.id+'" target="_new">'+
                      '<div title="Edit on Optimizely" class="edit button">'+
                          '<i class="fa fa-edit fa-fw"></i>'+
                      '</div>'+
                  '</a>'+
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
                  '</tr>';
                  for(i=exp.results.length -1;i >= 0;i--){
                    debugger;
                  	var result = exp.results[i];
                  	html = html+
                  	'<tr class="'+result.status+'" data-var-id="">'+
                        '<td class="first"><a target="_blank" href="'+exp.edit_url+ '?optimizely_x' +exp.id+ '='+result.variation_id+'">'+result.variation_name+'</a></td>'+
                        '<td>'+result.visitors+'</td>'+
                        '<td>'+result.conversions+'</td>'+
                        '<td>'+result.conversion_rate+'</td>'+
                        '<td>'+result.improvement+'</td>'+
                    '</tr>';
                  }
                  
                  html = html+
              '</table>'+
          '</div>'+
          '<div class="footer">'+
              '<div class="progressbar"></div><div class="ready"><i class="fa fa-clock-o fa-fw"></i> <span>Not Ready Yet!</span></div>'+
          '</div>'+
      '</div>';
      return html;
	}

}