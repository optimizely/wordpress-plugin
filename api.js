OptimizelyAPI = function(app_id, app_key) {
  this.app_id = app_id;
  this.app_key = app_key;
}

// Debug stuff, kill this later
log = function(data) {
  console.log(data);
}

OptimizelyAPI.prototype.get = function(endpoint, callback) {
  this.call('GET', endpoint, {}, callback);
}

OptimizelyAPI.prototype.delete = function(endpoint, callback) {
  this.call('DELETE', endpoint, {}, callback);
}

OptimizelyAPI.prototype.post = function(endpoint, data, callback) {
  this.call('POST', endpoint, data, callback);
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
    data: data,
    contentType: 'application/json',
    success: callback
  }

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

jQuery(document).ready(function() {
  configPage();
});