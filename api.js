OptimizelyAPI = function(app_id, app_key) {
  this.app_id = app_id;
  this.app_key = app_key;
  this.outstanding_requests = 0;
}

// Debug stuff, kill this later
log = function(data) {
  console.log(data);
}

OptimizelyAPI.prototype.get = function(endpoint, callback) {
  this.call('GET', endpoint, "", callback);
}

OptimizelyAPI.prototype.delete = function(endpoint, callback) {
  this.call('DELETE', endpoint, "", callback);
}

OptimizelyAPI.prototype.post = function(endpoint, data, callback) {
  this.call('POST', endpoint, data, callback);
}

OptimizelyAPI.prototype.patch = function(endpoint, data, callback) {
  var optly = this;
  optly.get(endpoint, function(base) {
    for (var key in data) {
      base[key] = data[key];
    }
    optly.put(endpoint, base, callback);
  })

}

OptimizelyAPI.prototype.put = function(endpoint, data, callback) {
  this.call('PUT', endpoint, data, callback);
}

OptimizelyAPI.prototype.call = function(type, endpoint, data, callback) {
  o = this;

  doCallback = function(response) {
    o.outstanding_requests -= 1;
    callback(response);
  }

  var options = {
    url: "https://www.optimizelyapis.com/api/" + endpoint,
    type: type,
    headers: {
      "App-Id": this.app_id,
      "App-Key": this.app_key
    },
    contentType: 'application/json',
    success: doCallback
  }
  if (data) {
    options.data = JSON.stringify(data);
    options.dataType = 'json';
  }

  console.log(options);
  o.outstanding_requests += 1;
  jQuery.ajax(options);
}



function configPage() {
  var $ = jQuery;

  // Select a project ID
  $('#project_id').change(function() {
    var id = $('#project_id').val();
    var name = $('#project_id option:selected').text();
    var project_code = '<script src="//cdn.optimizely.com/js/' + id + '.js"></script>';
    $('#project_code').text(project_code);
    $('#project_name').val(name);
  });

  // Get list of projects
  $("button#connect_optimizely").click(function(event) {
    event.preventDefault();
    $("#project_id").html("<option>Loading projects...</option>");
    
    optly = new OptimizelyAPI($("#app_id").val(), $("#app_key").val());
    optly.get('projects', function(response){
      $("#project_id").empty();          
      $.each(response, function(key, val) {
        $("#project_id").append("<option value='" + val.id + "'>" + val.project_name + "</option>"); 
      });
      $("#project_id").change()
    });



  });
}


function editPage() {
  var $ = jQuery;
  
  var postId = $('#post_ID').val();
  var projectId = $('#optimizely_project_id').val();
  var experimentId = $("#optimizely_experiment_id").val();

  optly = new OptimizelyAPI($("#optimizely_app_id").val(), $("#optimizely_app_key").val());

  function showExperimentData(experimentMeta) {
      $("#optimizely_experiment_id").val(experimentMeta.id);
      $('.optimizely_view').attr('href','https://www.optimizely.com/edit?experiment_id=' + experimentMeta.id);
      $('.optimizely_results').attr('href','https://www.optimizely.com/results?experiment_id=' + experimentMeta.id);

      $("#optimizely_experiment_status").val(experimentMeta.status);
      $('.optimizely_experiment_status_text').text(experimentMeta.status);
      if (experimentMeta.status == "Running") {
        $('.optimizely_toggle_running').text('Pause Experiment');
      } else {
        $('.optimizely_toggle_running').text('Start Experiment');
      }

      $('.not_created').hide();
      $('.created').show();  
  }

  function experimentCreated(experimentMeta) {
      if (optly.outstanding_requests == 0) {
        showExperimentData(experimentMeta)              
      }
  }

  if (experimentId) {
    showExperimentData({
      id: experimentId,
      status: $("#optimizely_experiment_status").val()
    });
  } else {
    $('.created').hide();
  }

  $('.optimizely_create').click(function() {
    $('.optimizely_create').text('Creating...');
    event.preventDefault();

    var originalTitle = $('#title').val();
    var experimentMeta = {
      'description': "Wordpress: " + originalTitle,
      'edit_url': $('#post-preview').attr('href')
    }
    var numVariations = $('.optimizely_variation').filter(function(){return $(this).val().length > 0}).length;
    numVariations += 1; // original

    if (!experimentId) {
      optly.post('projects/' + projectId + '/experiments', experimentMeta, afterCreateExperiment)
    } else {
      optly.patch('experiments/' + experimentId, experimentMeta, afterCreateExperiment)
    }

    function afterCreateExperiment(response) {
      
      // Save experiment data
      var experimentMeta = response;
      var experimentId = experimentMeta.id;
      $("#optimizely_experiment_id").val(experimentId);
      $("#optimizely_experiment_status").val(experimentMeta.status);
      $('.optimizely_experiment_status_text').text(experimentMeta.status);
      // todo: http://stackoverflow.com/questions/21711071/how-to-update-post-meta-on-wordpress-with-ajax

      // Set up variations
      var variationIds = experimentMeta.variation_ids;
      var variationWeight = Math.floor(10000 / numVariations);
      var leftoverWeight = 10000 - variationWeight*numVariations;
      for (var i = 1; i <= numVariations; i++) {
        var newTitle = $('#post_title' + i).val();
        if (newTitle) {
          var code = $('#optimizely_variation_template').val()
            .replace(/\$NEW_TITLE/g, newTitle)
            .replace(/\$POST_ID/g, postId);
        
          var variationId = variationIds[i] || $('#post_title' + i).attr('data-variation-id');
          var variationMeta = {
            "description": "Variation " + i + ": " + newTitle,
            "js_component": code,
            "weight": variationWeight + (i == 1 ? leftoverWeight : 0)
          }

          if (!variationId) {
            variationMeta = optly.post('experiments/' + experimentId + '/variations', variationMeta, afterCreateVariation);
          } else {
            variationMeta = optly.patch('variations/' + variationId, variationMeta, afterCreateVariation);
          }

          function afterCreateVariation(response) {
            variationMeta = response;
            variationId = variationMeta.id;
            $('#post_title' + i).attr('data-variation-id', variationId);
            experimentCreated(experimentMeta);
          }

        }
      }
    }

  });

  $('.optimizely_toggle_running').click(function(){
    event.preventDefault();

    // Stop running experiments
    if ($("#optimizely_experiment_status").val() == "Running") {
      $('.optimizely_toggle_running').text('Pausing...');
      optly.patch('experiments/' + $("#optimizely_experiment_id").val(), {'status': 'Paused'}, function(response) {
          showExperimentData(response)
        });

    // Start non-running experiments
    } else {
      $('.optimizely_toggle_running').text('Starting...');
      optly.patch('experiments/' + $("#optimizely_experiment_id").val(), {'status': 'Running'}, function(response) {
          showExperimentData(response)
        });
    }

  });
    
}

jQuery(document).ready(function() {
  configPage();
});