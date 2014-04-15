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
    showExperimentState(optly.experiment);
  } else {
    $('#optimizely_created').hide();
  }

  $('#optimizely_create').click(function(){
    createExperiment(optly.experiment);
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

    // Created?
    $('#optimizely_not_created').hide();
    $('#optimizely_created').show();  
  }

  function createExperiment(experiment) {
    $('#optimizely_create').text('Creating...');

    experiment.description = "Wordpress: " + $('#title').val();
    experiment.edit_url = $('#post-preview').attr('href'); // barfs on localhost :(

    // Create or update
    if (!experiment.id) {
      optly.post('projects/' + projectId + '/experiments', experiment, onExperimentCreated);
    } else {
      optly.patch('experiments/' + experiment.id, experiment, onExperimentCreated);
    }
  }

  function onExperimentCreated(experiment) {

    optly.experiment = experiment;
    // todo: http://stackoverflow.com/questions/21711071/how-to-update-post-meta-on-wordpress-with-ajax

    // Set variation weights
    var variations = $('.optimizely_variation').filter(function(){return $(this).val().length > 0})

    var numVariations = variations.length;
    numVariations += 1; // original
    var variationWeight = Math.floor(10000 / numVariations);
    var leftoverWeight = 10000 - variationWeight*numVariations;

    variations.each(function(i, elt) {
      var weight = variationWeight + (i == 0 ? leftoverWeight : 0);
      createVariation(i, $(elt).val(), weight);
    });

  }

  function createVariation(i, newTitle, weight) {

    // Generate variation code
    var postId = $('#post_ID').val();
    var originalTitle = $('#title').val();
    var code = $('#optimizely_variation_template').val()
      .replace(/\$OLD_TITLE/g, originalTitle)
      .replace(/\$NEW_TITLE/g, newTitle)
      .replace(/\$POST_ID/g, postId);

    var variation = {
      "description": "Variation #" + i + ": " + newTitle,
      "js_component": code,
      "weight": weight,
      "id": optly.experiment.variation_ids[i+1]
    }

    // Create or update
    if (!variation.id) {
      optly.post('experiments/' + optly.experiment.id + '/variations', variation, onVariationCreated);
    } else {
      optly.patch('variations/' + variation.id, variation, onVariationCreated);
    }

  }

  function onVariationCreated(variation) {
    if (optly.outstanding_requests == 0) {
      showExperiment(optly.experiment);
    }
  }

  function startExperiment(experiment) {
    $('#optimizely_toggle_running').text('Starting...');
    optly.patch('experiments/' + experiment.id, {'status': 'Running'}, function(response) {
      experiment = response;
      showExperiment(experiment);
    });
  }

  function pauseExperiment(experiment) {
    $('#optimizely_toggle_running').text('Pausing...');
    optly.patch('experiments/' + experiment.id, {'status': 'Paused'}, function(response) {
      experiment = response;
      showExperiment(experiment);
    });
  }

}





