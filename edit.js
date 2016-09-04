(function( $ ) {

	var optimizelyXEditPage = {};
	window.optimizelyXEditPage = optimizelyXEditPage;
	optimizelyXEditPage._experiment;
	optimizelyXEditPage._authentication;
	optimizelyXEditPage._project_id;
	optimizelyXEditPage._experiment_id;
	optimizelyXEditPage._client;
	optimizelyXEditPage.init = function() {
	  // Initialize data from the input fields
	  var projectId = $('#optimizely_project_id').val();
	  optimizelyXEditPage._token = $('#optimizely_token').val()
	  swaggerPromise.then(function(client) {
	      optimizelyXEditPage._client = client;
	      var experiment_id = $('#optimizely_experiment_id').val();
				optimizelyXEditPage._experiment_id = experiment_id;
				var project_id = $( '#optimizely_project_id' ).val();
				optimizelyXEditPage._project_id = parseInt(project_id);
	      var experiment_status = $('#optimizely_experiment_status').val();
	      var token = $('#optimizely_token').val();
	      optimizelyXEditPage._authentication = {
	        clientAuthorizations: {
	          token: new SwaggerClient.ApiKeyAuthorization('Token', token, 'header'),
	        }
	      };

	      if (!!experiment_id) {
	        optimizelyXEditPage._client.Experiments.get_experiment({
	          'experiment_id': experiment_id
	        }, optimizelyXEditPage._authentication).then(function(experiment) {
	          optimizelyXEditPage._experiment = experiment.obj;
	          optimizelyXEditPage.showExperiment(optimizelyXEditPage._experiment);
	        })
	      } else {
	        optimizelyXEditPage._experiment = {
	          id: experiment_id,
	          status: experiment_status
	        }

	        $('#optimizely_not_created').show();
	        $('#optimizely_created').hide();
	      }

	      // On click, run the createExperiment function
	      $('#optimizely_create').click(function() {
					var variations = $( '.optimizely_variation' ).filter(function() {
						return $( this ).val().length > 0
					});
					if(variations.length > 0){
						optimizelyXEditPage.createExperiment();
					} else {
						$(".optimizely_create_error").text('You need at least one variations to create the experiment.').show().fadeOut(3000);
					}
	      });

	      // Then, handle starts and pauses on the experiment
	      $('#optimizely_toggle_running').click(function() {
	        if (optimizelyXEditPage._experiment.status == 'active') {
	          optimizelyXEditPage.pauseExperiment(optimizelyXEditPage._experiment);
	        } else {
	          optimizelyXEditPage.startExperiment(optimizelyXEditPage._experiment);
	        }
	      });

	  });
	}
	optimizelyXEditPage.startExperiment = function(experiment){
		$( '#optimizely_toggle_running' ).text( 'Starting...' );
		var body = { 'status': 'active' };
		optimizelyXEditPage._client.Experiments.update_experiment({'experiment_id': experiment.id, body: body, override_changes: true}, optimizelyXEditPage._authentication).then(function(experiment){
			optimizelyXEditPage._experiment = experiment.obj;
			optimizelyXEditPage.showExperiment( optimizelyXEditPage._experiment );
		});
	};
	optimizelyXEditPage.pauseExperiment = function(experiment){
		$( '#optimizely_toggle_running' ).text( 'Pausing...' );
		var body = { 'status': 'paused' };
		optimizelyXEditPage._client.Experiments.update_experiment({'experiment_id': experiment.id, body: body, override_changes: true}, optimizelyXEditPage._authentication).then(function(experiment){
			optimizelyXEditPage._experiment = experiment.obj;
			optimizelyXEditPage.showExperiment( optimizelyXEditPage._experiment );
		});
	};
	optimizelyXEditPage.createExperiment = function(){
		$( '#optimizely_create' ).text( 'Creating...' );
		var experiment = {};
		var targeting_page = {};
		var event_page = {};

		post_id = $( '#post_ID' ).val();

		experiment.name = 'Wordpress [' + post_id + ']: ' + $( '#title' ).val();
		targeting_page.name = 'Wordpress [' + post_id + ']: ' + $( '#title' ).val() + ' targeting page';
		event_page.name = 'Wordpress [' + post_id + ']: ' + $( '#title' ).val() + ' event page';

		// Activation Mode
		var activation_mode = $( '#optimizely_activation_mode' ).val();
		if('conditional' === activation_mode ){
			targeting_page.activation_type = "polling";
			targeting_page.activation_code = optimizelyXEditPage.helpers.replacePlaceholderVariables( $( '#optimizely_conditional_activation_code' ).val() , "" );
		} else {
			targeting_page.activation_type = "immediate";
		}
		event_page.activation_type = "immediate";

		targeting_page.edit_url = $( '#optimizely_experiment_url' ).val();
		event_page.edit_url = $( '#optimizely_experiment_url' ).val();

		// Setup url targeting
		var loc = document.createElement( 'a' );
		loc.href = targeting_page.edit_url;
		var urlTargetdomain = loc.hostname;
		var urlTargetType = 'substring';
		if ( "" != $( '#optimizely_url_targeting' ).val() &&  "" != $( '#optimizely_url_targeting_type' ).val() ){
			urlTargetdomain = $( '#optimizely_url_targeting' ).val();
			urlTargetType = $( '#optimizely_url_targeting_type' ).val();
		}
		var targeting_conditions = ["and",["or",{"match_type":urlTargetType,"type":"url","value":urlTargetdomain}]];
		var event_conditions = ["and",["or",{"match_type":"substring","type":"url","value":event_page.edit_url}]];

		targeting_page.conditions = JSON.stringify(targeting_conditions);
		event_page.conditions = JSON.stringify(event_conditions);

		targeting_page.project_id = optimizelyXEditPage._project_id;
		event_page.project_id = optimizelyXEditPage._project_id;

		//optly.post( 'projects/' + projectId + '/experiments', experiment, onExperimentCreated );
		var targeting_promise = optimizelyXEditPage._client.Pages.create_page({body: targeting_page}, optimizelyXEditPage._authentication);
		var event_promise = optimizelyXEditPage._client.Pages.create_page({body: event_page}, optimizelyXEditPage._authentication);
		var pages_promise = Promise.all([targeting_promise, event_promise]);

		pages_promise.then(function(pages){

			var targeting_id = pages[0].obj.id;
			var event_id = pages[1].obj.id;
			var variations = optimizelyXEditPage.helpers.createVariations(targeting_id);
			experiment['project_id'] = optimizelyXEditPage._project_id;
			experiment['metrics'] = [ {'kind': 'view', 'id': event_id}];
			experiment['variations'] = variations;
			optimizelyXEditPage._client.Experiments.create_experiment({body: experiment}, optimizelyXEditPage._authentication).then(function(experiment){
				optimizelyXEditPage._experiment = experiment.obj;
				optimizelyXEditPage.showExperiment(optimizelyXEditPage._experiment);
			});
		})
	};
	optimizelyXEditPage.showExperiment = function(experiment){
		// ID and links
		$( '#optimizely_experiment_id' ).val( experiment.id );
		$( '#optimizely_view' ).attr( 'href', 'https://app.optimizely.com/v2/projects/' + experiment.project_id + '/campaigns/' + experiment.campaign_id );

		// Status and buttons
		$( '#optimizely_experiment_status' ).val( experiment.status );
		$( '#optimizely_experiment_status_text' ).text( experiment.status );
		if ( experiment.status == 'active' ) {
			$( '#optimizely_toggle_running' ).text( 'Pause Experiment' );
		} else {
			$( '#optimizely_toggle_running' ).text( 'Start Experiment' );
		}

		// Hide create button, show status
		$( '#optimizely_not_created' ).hide();
		$( '#optimizely_created' ).show();

		// Update Wordpress backend w/ experiment data
		var data = {
			action: 'update_experiment_meta',
			post_id: $( '#post_ID' ).val(),
			optimizely_experiment_id: experiment.id,
			optimizely_experiment_status: experiment.status
		};

		$( '.optimizely_variation' ).each(function( index, input ) {
			data[ $( input ).attr( 'name' ) ] = $( input ).val();
		});
			$.post( wpAjaxUrl, data );

	};

	optimizelyXEditPage.helpers = {};
	optimizelyXEditPage.helpers.replacePlaceholderVariables = function(template, newTitle){
		var postId = $( '#post_ID' ).val();
		var originalTitle = $( '#title' ).val();
		var code = template
			.replace( /\$OLD_TITLE/g, originalTitle )
			.replace( /\$NEW_TITLE/g, newTitle )
			.replace( /\$POST_ID/g, postId );

		return code;
	};
	optimizelyXEditPage.helpers.createVariation = function( index, newTitle, weight, page_id) {
		// Generate variation code
		var variationTemplate = $( '#optimizely_variation_template' ).val();
		var postId = $( '#post_ID' ).val();
		var originalTitle = $( '#title' ).val();
		var code = optimizelyXEditPage.helpers.replacePlaceholderVariables( variationTemplate , newTitle );

		// Request data
		var variation = {
			name: newTitle,
			weight: weight,
			"actions": [{
	      "changes": [{
	        "type": "custom_code",
	        "dependencies": [],
	        "async": false,
	        "id": optimizelyXEditPage.helpers.generateUUID(),
	        "value": code
	      }],
	      "page_id": page_id
	    }]
		}

		return variation;
	}
	optimizelyXEditPage.helpers.createVariations = function(page_id){
		var variations = $( '.optimizely_variation' ).filter(function() {
			return $( this ).val().length > 0
		});

		// Set variation weights
		var numVariations = variations.length + 1;
		var variationWeight = Math.floor( 10000 / numVariations );
		var leftoverWeight = 10000 - ( variationWeight * numVariations );

		var variationWeights = [];
		for(var i = 0; i < numVariations; i++){
			if(i < numVariations - 1){
				variationWeights.push(variationWeight);
			} else {
				variationWeights.push(variationWeight + leftoverWeight);
			}
		}

		var original = {
			name: 'Original',
			weight: variationWeight,
			"actions": [{
	      "changes": [],
	      "page_id": page_id
	    }]
		}
		var variation_data = [original];

		// Create variations
		variations.each(function( index, input ) {
			var weight = variationWeight;
			variation_data.push(optimizelyXEditPage.helpers.createVariation( index + 1, $( input ).val(), variationWeights[index], page_id));
		});
		console.log(variation_data)
		return variation_data;
	}

	optimizelyXEditPage.helpers.generateUUID = function(){
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
		});
		return uuid;
	};

	function optimizelyClassicEditPage() {
		// Initialize data from the input fields
		var projectId = $( '#optimizely_project_id' ).val();
		var optly = new OptimizelyAPI( $( '#optimizely_token' ).val() );

		if ( !! $( '#optimizely_experiment_id' ).val() ) {
			optly.get( 'experiments/' + $( '#optimizely_experiment_id' ).val(), function( response ) {
				optly.experiment = response;
				showExperiment( optly.experiment );
			});
		} else {
			optly.experiment = {
				id: $( '#optimizely_experiment_id' ).val(),
				status: $( '#optimizely_experiment_status' ).val()
			}
			$( '#optimizely_not_created' ).show();
			$( '#optimizely_created' ).hide();
		}

		// On click, run the createExperiment function
		$( '#optimizely_create' ).click(function() {
			createExperiment();
		});

		// Then, handle starts and pauses on the experiment
		$( '#optimizely_toggle_running' ).click(function() {
			if ( optly.experiment.status == 'Running' ) {
				pauseExperiment( optly.experiment );
			} else {
				startExperiment( optly.experiment );
			}
		});

		// Render the experiment's state on the page
		function showExperiment( experiment ) {
			// ID and links
			$( '#optimizely_experiment_id' ).val( experiment.id );
			$( '#optimizely_view' ).attr( 'href', 'https://app.optimizely.com/edit?experiment_id=' + experiment.id );
			console.log('showexp');
			// Status and buttons
			$( '#optimizely_experiment_status' ).val( experiment.status );
			$( '#optimizely_experiment_status_text' ).text( experiment.status );
			if ( experiment.status == 'Running' ) {

				$( '#optimizely_toggle_running' ).text( 'Pause Experiment' );
			} else {
				$( '#optimizely_toggle_running' ).text( 'Start Experiment' );
			}

			// Hide create button, show status
			$( '#optimizely_not_created' ).hide();
			$( '#optimizely_created' ).show();

			// Update Wordpress backend w/ experiment data
			var data = {
				action: 'update_experiment_meta',
				post_id: $( '#post_ID' ).val(),
				optimizely_experiment_id: experiment.id,
				optimizely_experiment_status: experiment.status
			};

			$( '.optimizely_variation' ).each(function( index, input ) {
				data[ $( input ).attr( 'name' ) ] = $( input ).val();
			});
				$.post( wpAjaxUrl, data );
		}

		/*
		Replace all dynamic place holders with the values of the post and variation
		*/

		function replacePlaceholderVariables (template, newTitle){
			var postId = $( '#post_ID' ).val();
			var originalTitle = $( '#title' ).val();
			var code = template
				.replace( /\$OLD_TITLE/g, originalTitle )
				.replace( /\$NEW_TITLE/g, newTitle )
				.replace( /\$POST_ID/g, postId );

			return code;
		}

		// This function creates an experiment by providing a description based on the post's title and an edit_url based on the permalink of the Wordpress post. We send these as a POST request and register a callback to run the onExperimentCreated function when it completes.
		function createExperiment() {
			$( '#optimizely_create' ).text( 'Creating...' );
			experiment = {};
			post_id = $( '#post_ID' ).val();
			experiment.description = 'Wordpress [' + post_id + ']: ' + $( '#title' ).val();

			// Activation Mode
			experiment.activation_mode = $( '#optimizely_activation_mode' ).val();
			if('conditional' === experiment.activation_mode ){
				experiment.conditional_code = replacePlaceholderVariables( $( '#optimizely_conditional_activation_code' ).val() , "" );
			}
			experiment.edit_url = $( '#optimizely_experiment_url' ).val();

			// Setup url targeting
			var loc = document.createElement( 'a' );
			loc.href = experiment.edit_url;
			var urlTargetdomain = loc.hostname;
			var urlTargetType = 'substring';
			if ( "" != $( '#optimizely_url_targeting' ).val() &&  "" != $( '#optimizely_url_targeting_type' ).val() ){
				urlTargetdomain = $( '#optimizely_url_targeting' ).val();
				urlTargetType = $( '#optimizely_url_targeting_type' ).val();
			}
			experiment.url_conditions = [
				{
					'match_type': urlTargetType,
					'value': urlTargetdomain
				}
			];

			optly.post( 'projects/' + projectId + '/experiments', experiment, onExperimentCreated );
		}

		/*
		The experiment we created has two built-in variations, but now we need to add a third and update the content.
		Since we're adding a variation, we also need to calculate the traffic weight to use for each one.
		Once we've done this, we'll call the createVariation function explained below.
		Our experiment comes with an Engagement goal, but we'll also add one to measure views to the post.
		*/
		function onExperimentCreated( experiment ) {
			// Pause for 200ms so that the experiment is guarenteed to be created before editing and adding variations
			setTimeout(function() {
				optly.experiment = experiment;
				var variations = $( '.optimizely_variation' ).filter(function() {
					return $( this ).val().length > 0
				});

				// Set variation weights
				var numVariations = variations.length + 1;
				var variationWeight = Math.floor( 10000 / numVariations );
				var leftoverWeight = 10000 - ( variationWeight * numVariations );

				// Create variations
				variations.each(function( index, input ) {
					var weight = variationWeight;
					setTimeout(function() {
						createVariation( experiment, index + 1, $( input ).val(), weight );
					}, 200 );
				});

				// Update original with correct traffic allocation
				var origVariationWeight = { 'weight': variationWeight + ( leftoverWeight > 0 ? leftoverWeight : 0 ) };
				optly.patch( 'variations/' + experiment.variation_ids[0], origVariationWeight, checkExperimentReady );

				// Create goal
				createGoal( experiment );
			}, 1000 );
		}

		/*
		We create a pageview goal that measures how many times the post is viewed.
		We add one url, the permalink, and use the substring match type.
		We also set 'addable' to false so that the goal won't clog up the list of goals for other experiments.
		Finally, we associate the goal with the experiment we just created by adding the experiment's id to experiment_ids.
		We POST the goal to the projects/{id}/goals endpoint to create it.
		*/
		function createGoal( experiment ) {
			var goal = {
				goal_type: 3, // pageview goal
				title: 'Views to page',
				urls: [ $( '#optimizely_experiment_url' ).val() ],
				url_match_types: [4], // substring
				addable: false, // don't clog up the goal list
				experiment_ids: [ experiment.id ]
			}

			optly.post( 'projects/' + experiment.project_id + '/goals/', goal, checkExperimentReady );
		}


		/*
		To create a variation, we first generate the variation code.
		We use a template based on the Wordpress theme, and then we drop in the values for our variation. The result would be:
		$( '.post-27 .entry-title a' ).text( 'Alternate Title #1' );
		Once we've generated this variation code, we include it in the js_component parameter of our API request.
		We also add a variation title and weight.
		In this example, we have two alternate headlines plus an original.
		When we created the experiment, it also came with two variations that were created automatically.
		We'll leave variation 0 alone as the original, update variation 1 to use the first alternate headline, and create a new variation 2 with the second alternate headline.
		*/
		function createVariation( experiment, index, newTitle, weight ) {
			// Generate variation code
			var variationTemplate = $( '#optimizely_variation_template' ).val();
			var postId = $( '#post_ID' ).val();
			var originalTitle = $( '#title' ).val();
			var code = replacePlaceholderVariables( variationTemplate , newTitle );

			// Request data
			var variation = {
				'description': newTitle,
				'js_component': code,
				'weight': weight,
			}

			// Update variation #1, create the others
			if ( index == 1 ) {
				optly.patch( 'variations/' + experiment.variation_ids[1], variation, checkExperimentReady );
			} else {
				optly.post( 'experiments/' + experiment.id + '/variations', variation, checkExperimentReady );
			}
		}

		/*
		Once all the PUT and POST requests have returned, we're done!
		At this point, we can let the user know that the experiment is created and ready.
		*/
		function checkExperimentReady( response ) {
			if ( 0 == optly.outstandingRequests ) {
				showExperiment( optly.experiment );
			}
		}

		/*
		To start a pause an experiment, we just need to change it's status to running.
		The patch method GETs the experiment metadata, changes the specified fields, and PUTs the object back to Optimizely.
		*/
		function startExperiment( experiment ) {
			$( '#optimizely_toggle_running' ).text( 'Starting...' );
				optly.patch( 'experiments/' + experiment.id, { 'status': 'Running' }, function( response ) {
				optly.experiment = response;
				showExperiment( optly.experiment );
			});
		}

		function pauseExperiment( experiment ) {
			$( '#optimizely_toggle_running' ).text( 'Pausing...' );
				optly.patch( 'experiments/' + experiment.id, { 'status': 'Paused' }, function( response ) {
				optly.experiment = response;
				showExperiment( optly.experiment );
			});
		}

	}

	$( document ).ready(function() {
		if(window.optimizely_platform === 'optimizely_classic'){
			optimizelyClassicEditPage();
		} else {
			optimizelyXEditPage.init();
		}
	});

})( jQuery );
