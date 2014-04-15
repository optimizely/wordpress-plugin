function optimizelyConfigPage() {
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
    
    optly = new OptimizelyAPI($("#token").val());

    optly.get('projects', function(response) {
      $("#project_id").empty();

      $.each(response, function(key, val) {
        $("#project_id").append("<option value='" + val.id + "'>" + val.project_name + "</option>"); 
      });
      
      $("#project_id").change();
    });



  });
}