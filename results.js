
function optimizelyResultsPage(apiToken,projectId) {
	var $ = jQuery;

	var optly = new OptimizelyAPI(apiToken);  
	
	//fetch only Wordpress experiments from project
	optly.get('projects/' + projectId + '/experiments/', function(response) {
		optly.wordpressExps = [];
		for (i=0; i<response.length; i++) {
			if (response[i].description.indexOf('Wordpress') > -1) {
				optly.wordpressExps.push(response[i]);
			}
		}
		getWPExpResults(optly.wordpressExps);
	});

	//launch winning variation when Launch button is clicked...will this work with 
	$(".launch").bind('click', function() {
   		var loserVars = [];
   		$(this).parents('.opt_results').find("tr:not('.winner')").each(function() {  //[NEED] loser class or use "tr:not('.winner')""
      		loserVars.push($(this).attr('data-var-id'));
   			launchWinner(loserVars);
		});
	});

	function getWPExpResults(WPexpArray) {
		optly.results = [];
		for (j=0; j < WPexpArray.length; j++){
			optly.get('experiments/' + WPexpArray[j].id + '/results', function(response) { 
				 optly.results.push(response);
			});
		}
	}

	function launchWinner(loserArray) {
		for (i=0; i<loserArray.length; i++) {
			optly.patch('variations/' + loserArray[i], {'is_paused': 'true'}, function(response) {
      			optly.experiment = response;
      			//function to update UI
    		});
		}	
  	} 

}