OptimizelyAPI = function(token) {
  this.token = token;
  this.outstanding_requests = 0;
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
  var optly = this;

  var options = {
    url: "https://www.optimizelyapis.com/experiments/v1/" + endpoint,
    type: type,
    headers: {
      "token": this.token
    },
    contentType: 'application/json',
    success: function(response) {
      optly.outstanding_requests -= 1;
      callback(response);
    }
  }

  var body = {}
  for (key in data || {}) {
    if (data[key]) {
      body[key] = data[key];
    }
  }

  if (body) {
    options.data = JSON.stringify(body);
    options.dataType = 'json';
  }

  optly.outstanding_requests += 1;
  jQuery.ajax(options);
}