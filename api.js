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

  console.log(options);
  jQuery.ajax(options);
}






