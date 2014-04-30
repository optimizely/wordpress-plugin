function optimizelyEditPage() {
  var $ = jQuery;

  // Initialize data
  var projectId = $('#optimizely_project_id').val();
  var optly = new OptimizelyAPI($("#optimizely_token").val()); 
  optly.experiment = {
    id: $("#optimizely_experiment_id").val(),
    status: $("#optimizely_experiment_status").val()
  }

  if (optly.experiment.id) {
    showExperiment(optly.experiment);
  } else {
    $('#optimizely_created').hide();
  }

  $('#optimizely_create').click(function(){
    createExperiment();
  });

  $('#optimizely_toggle_running').click(function(){
    if (optly.experiment.status == "Running") {
      pauseExperiment(optly.experiment);
    } else {
      startExperiment(optly.experiment);
    }
  });

  // Render the experiment's state on the page
  function showExperiment(experiment) {
    // ID and links
    $("#optimizely_experiment_id").val(experiment.id);
    $('#optimizely_view').attr('href','https://www.optimizely.com/edit?experiment_id=' + experiment.id);
    $('#optimizely_results').attr('href','https://www.optimizely.com/results?experiment_id=' + experiment.id);

    // Status and buttons
    $("#optimizely_experiment_status").val(experiment.status);
    $('#optimizely_experiment_status_text').text(experiment.status);
    if (experiment.status == "Running") {
      $('#optimizely_toggle_running').text('Pause Experiment');
    } else {
      $('#optimizely_toggle_running').text('Start Experiment');
    }

    // Hide create button, show status
    $('#optimizely_not_created').hide();
    $('#optimizely_created').show();  

    // Update Wordpress backend w/ experiment data
    var data = {
      action: "update_experiment_meta",
      post_id: $('#post_ID').val(),
      optimizely_experiment_id: experiment.id,
      optimizely_experiment_status: experiment.status
    };

    $('.optimizely_variation').each(function(index, input) {
      data[$(input).attr('name')] = $(input).val();
    });
    $.post(wpAjaxUrl, data);
  }

  function createExperiment() {
    $('#optimizely_create').text('Creating...');

    experiment = {};
    experiment.description = "Wordpress: " + $('#title').val();
    experiment.edit_url = $('#sample-permalink').text();

    optly.post('projects/' + projectId + '/experiments', experiment, onExperimentCreated);
  }

  function onExperimentCreated(experiment) {

    optly.experiment = experiment;

    var variations = $('.optimizely_variation').filter(function(){return $(this).val().length > 0})
    
    // Set variation weights
    var numVariations = variations.length + 1;
    var variationWeight = Math.floor(10000 / numVariations);
    var leftoverWeight = 10000 - variationWeight*numVariations;

    // Create variations
    variations.each(function(index, input) {
      var weight = variationWeight + (index == 0 ? leftoverWeight : 0);
      createVariation(experiment, index + 1, $(input).val(), weight);
    });

    // Create goal
    createGoal(experiment);

  }

  function createGoal(experiment) {

    var goal = {
      goal_type: 3, // pageview goal
      title: "Views to page",
      urls: [$('#sample-permalink').text()],
      url_match_types: [4], // substring
      // addable: false, // don't clog up the goal list
      experiment_ids: [experiment.id]
    }

    optly.post('projects/' + experiment.project_id + '/goals/', goal, onGoalCreated);

  }

  function onGoalCreated(goal) {

  }

  function createVariation(experiment, index, newTitle, weight) {

    // Generate variation code
    var variationTemplate = $('#optimizely_variation_template').val();
    var postId = $('#post_ID').val();
    var originalTitle = $('#title').val();
    var code = variationTemplate
      .replace(/\$OLD_TITLE/g, originalTitle)
      .replace(/\$NEW_TITLE/g, newTitle)
      .replace(/\$POST_ID/g, postId);

    // Request data
    var variation = {
      "description": newTitle,
      "js_component": code,
      "weight": weight,
    }

    // Update variation #1, create the others
    if (index == 1) {
      optly.patch('variations/' + experiment.variation_ids[1], variation, onVariationCreated);
    } else {
      optly.post('experiments/' + experiment.id + '/variations', variation, onVariationCreated);
    }

  }

  function onVariationCreated(variation) {
    if (optly.outstandingRequests == 0) {
      showExperiment(optly.experiment);
    }
  }

  function startExperiment(experiment) {
    $('#optimizely_toggle_running').text('Starting...');
    optly.patch('experiments/' + experiment.id, {'status': 'Running'}, function(response) {
      optly.experiment = response;
      showExperiment(optly.experiment);
    });
  }

  function pauseExperiment(experiment) {
    $('#optimizely_toggle_running').text('Pausing...');
    optly.patch('experiments/' + experiment.id, {'status': 'Paused'}, function(response) {
      optly.experiment = response;
      showExperiment(optly.experiment);
    });
  }

}





