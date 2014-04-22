OptimizelyAPI = function(token) {
  this.outstandingRequests = 0;
  this.token = token;
}

OptimizelyAPI.prototype.call = function(type, endpoint, data, callback) {

  var self = this;

  var options = {
    url: "https://www.optimizelyapis.com/experiment/v1/" + endpoint,
    type: type,
    headers: {"Token": this.token},
    contentType: 'application/json',
    success: function(response) {
      self.outstandingRequests -= 1;
      callback(response);
    }
  }

  if (data) {
    options.data = JSON.stringify(data);
    options.dataType = 'json';
  }

  this.outstandingRequests += 1;
  jQuery.ajax(options);

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

OptimizelyAPI.prototype.put = function(endpoint, data, callback) {
  this.call('PUT', endpoint, data, callback);
}

OptimizelyAPI.prototype.patch = function(endpoint, data, callback) {
  var self = this;
  self.get(endpoint, function(base) {
    for (var key in data) {
      base[key] = data[key];
    }
    self.put(endpoint, base, callback);
  });
}