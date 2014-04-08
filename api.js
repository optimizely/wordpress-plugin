OptimizelyAPI = function(app_id, app_key) {
  this.app_id = app_id;
  this.app_key = app_key;
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

  var options = {
    url: "https://www.optimizelyapis.com/api/" + endpoint,
    type: type,
    dataType: 'json',
    headers: {
      App_Id: this.app_id,
      App_Key: this.app_key
    },
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: callback
  }
  console.log(options);
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

  $('.optimizely_start').click(function() {
    event.preventDefault();
    optly = new OptimizelyAPI($("#optimizely_app_id").val(), $("#optimizely_app_key").val());

    var originalTitle = $('#title').val();
    var postId = $('#post_ID').val();
    var projectId = $('#optimizely_project_id').val();
    var experimentId = $("#optimizely_experiment_id").val();
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
      var experimentMeta = response;
      var experimentId = experimentMeta.id;
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
            console.log(id);
          }


        }
      }
    }

  });
}

jQuery(document).ready(function() {
  configPage();
});