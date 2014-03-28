OptimizelyAPI = function(app_id, app_key) {
  this.app_id = app_id;
  this.app_key = app_key;
}

OptimizelyAPI.prototype.get = function(endpoint, data, callback) {

  var options = {
    url: "https://www.optimizelyapis.com/api/" + endpoint,
    dataType: 'json',
    headers: {
      App_Id: this.app_id,
      App_Key: this.app_key
    },
    data: data,
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
    optly.get('projects', null, function(response){
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