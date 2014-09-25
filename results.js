
function optimizelyResultsPage(apiToken,projectId) {
	var $ = jQuery;

	var optly = new OptimizelyAPI(apiToken);  

	//fetch only Wordpress experiments from project
	optly.get('projects/' + projectId + '/experiments/', function(response) {
		optly.wordpressExps = [];
		for (i=0; i<response.length; i++) {
			// response[i].description.indexOf('Wordpress') > -1 && 
			if (response[i].status != 'Archived' && response[i].status != 'Draft') {
				//optly.wordpressExps.push(response[i]);
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
				//if(result.goal_name.indexOf('Views to page') > -1){
					expObj.results.push(result);
				//}
			}
			//finalExpArray.push(expObj);
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
                '<div class="title"><i class="fa fa-check-circle fa-fw"></i>'+exp.description+'</div>'+
                '<div class="results_toolbar">'+
                    '<div class="'+statusClass+' button">'+
                        '<i class="fa fa-'+statusClass+' fa-fw"></i>'+
                    '</div>'+
                    '<a href="https://www.optimizely.com/edit?experiment_id='+exp.id+'" target="_new">'+
	                    '<div class="edit button">'+
	                        '<i class="fa fa-edit fa-fw"></i>'+
	                    '</div>'+
	                '</a>'+
                    '<a href="'+previewURL+'" target="_new">'+
	                    '<div class="prev button">'+
	                        '<i class="fa fa-eye fa-fw"></i>'+
	                    '</div>'+
                    '</a>'+
                    '<div class="launch button">'+
                        '<i class="fa fa-rocket fa-fw"></i>'+
                    '</div>'+
                    '<div class="archive button">'+
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
        '</div>';
        return html;
	}

}