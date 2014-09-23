
function optimizelyResultsPage() {
	var $ = jQuery;


	var projectId = $('#optimizely_project_id').val();  
	var optly = new OptimizelyAPI($("#optimizely_token").val());  
	
	optly.get('projects/' + projectId + '/experiments/', function(response) {
		optly.wordpressExps = [];
		for (i=0; i<response.length; i++) {
			if (response[i].description.indexOf('Wordpress') > -1) {
				optly.wordpressExps.push(response[i]);
			}
		}
		getWPExpResults(optly.wordpressExps);
	});

	function getWPExpResults(WPexpArray) {
		optly.results = [];
		for (j=0; j<expArray.length; j++){
			optly.get('experiments/' + WPexpArray[j].id + '/results', function(response) { //this is throwing an error
				 
				 optly.results.push(response);
			});
		}
	}

	/* function launchVariation(experiment) {
		var varId = $(".variation_id[data=XXXXXXXX]").val();  //store var id
    	$('#optimizely_launch_var').text('Launching...');  //[NEED] update selectors, etc.
    	//for each variation that is not the one being launched, set is_paused=true
    	optly.patch('variations/' + optly.experiment.results[The other vars], {'is_paused': 'true'}, function(response) {
      		optly.experiment = response;
  			//need to call function that updates UI
    	});
  	} */

}