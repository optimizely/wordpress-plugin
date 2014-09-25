
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
      var averageVisitorPerVariation = 20000,
          poweredPercentage = Math.round((averageVisitorPerVariation/poweredVisitor)*100);
      progressbar.progressbar({
        value: averageVisitorPerVariation,
        max: poweredVisitor
      });

      var progBarColor = '#FF0000';
      switch(true){
        case (poweredPercentage < 10):
          progBarColor = "#FF0011";
          break;
        case (poweredPercentage >= 10 && poweredPercentage < 30):
          progBarColor = "#FF0011";
          break;
        case (poweredPercentage >= 30 && poweredPercentage < 50):
          progBarColor = "#FF0011";
          break;
        case (poweredPercentage >= 50 && poweredPercentage < 70):
          progBarColor = "#FF0011";
          break;
        case (poweredPercentage >= 70 && poweredPercentage < 90):
          progBarColor = "#FF0011";
          break;
        case (poweredPercentage >= 90 && poweredPercentage < 100):
          progBarColor = "#FF0011";
          break;
        default:
          progBarColor = "#00FF00";
          break;
      }

      $(progressbar).find('.ui-progressbar-value').css({'background':progBarColor,'border':'1px solid '+progBarColor});
    }


  	function buildResultsModuleHTML(exp) {
  		// Set the checkbox html
  		var statusClass = 'play';
  		if(exp.status == "Running"){
  			statusClass = 'pause';
  		}
  		var previewURL = exp.edit_url+ "?optimizely_x" +exp.id+ "=1";
  		if (exp.edit_url.indexOf('?') > -1) {
  			previewURL = exp.edit_url+ "&optimizely_x" +exp.id+ "=1";
  		} 

	    var html = ""+
	    '<div id="exp_'+exp.id+'" data-exp-id="'+exp.id+'" class="opt_results">'+
          '<div class="header">'+
              '<div class="title">'+exp.description+'</div>'+
              '<div class="results_toolbar">'+
                  '<div class="'+statusClass+' button">'+
                      '<i class="fa fa-'+statusClass+' fa-fw"></i>'+
                  '</div>'+
                  '<div class="edit button">'+
                      '<i class="fa fa-edit fa-fw"></i>'+
                  '</div>'+
                  '<div class="prev button">'+
                      '<i class="fa fa-eye fa-fw"></i>'+
                  '</div>'+
                  '<div class="launch button">'+
                      '<i class="fa fa-rocket fa-fw"></i>'+
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
                  for(i=0;i < exp.results.length;i++){
                  	var result = exp.results[i];
                  	html = html+
                  	'<tr class="'+result.status+'" data-var-id="">'+
                        '<td class="first">'+result.variation_name+'</td>'+
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
              '<div class="progressbar"></div><i class="fa fa-clock-o fa-fw"></i> Not Ready Yet!'+
          '</div>'+
      '</div>';
      return html;
	}

}